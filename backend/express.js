const express = require("express")
const path = require("path")
const { Transform } = require("stream")
const { pipeline } = require("stream/promises")
const pool = require("./db")
require("dotenv").config({ path: path.join(__dirname, ".env") })

const app = express()
const PORT = 3000
const frontendPath = path.join(__dirname, "..", "frontend")
const exportTable = process.env.DB_EXPORT_TABLE || "datasets"

if (!/^[A-Za-z0-9_]+$/.test(exportTable)) {
    throw new Error("DB_EXPORT_TABLE must contain only letters, numbers, and underscores")
}

function escapeCsv(value) {
    if (value == null) return ""
    const text = String(value)
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function csvTransform(columns) {
    let headerWritten = false
    return new Transform({
        objectMode: true,
        transform(row, encoding, callback) {
            if (!headerWritten) {
                this.push(`${columns.join(",")}\r\n`)
                headerWritten = true
            }
            this.push(`${columns.map(c => escapeCsv(row[c])).join(",")}\r\n`)
            callback()
        }
    })
}

app.use(express.static(frontendPath))

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"))
})

const CAMPD_PARAM_MAP = {
    state: "stateCode",
    year: "year",
    facility: "facilityId",
    unit: "unitType",
    limit: "perPage",
    page: "page"
}

app.get("/api/emissions", async (req, res) => {
    if (!process.env.CAMPD_API_URL || !process.env.CAMPD_API_KEY) {
        return res.status(500).json({ error: "CAMPD_API_URL and CAMPD_API_KEY must be configured in backend/.env" })
    }
    if (!req.query.year) {
        return res.status(400).json({ error: "year is required" })
    }

    const params = new URLSearchParams({ api_key: process.env.CAMPD_API_KEY, page: "1", perPage: "500" })
    for (const [name, campdName] of Object.entries(CAMPD_PARAM_MAP)) {
        if (req.query[name]) params.set(campdName, req.query[name])
    }

    try {
        const response = await fetch(`${process.env.CAMPD_API_URL}?${params}`)
        const body = await response.text()
        if (!response.ok) {
            console.error("CAMPD request failed", response.status, body)
            return res.status(response.status).json({ error: "CAMPD request failed" })
        }
        res.type("application/json").send(body)
    } catch (error) {
        console.error("CAMPD request failed", error)
        res.status(502).json({ error: "Unable to reach CAMPD" })
    }
})

const EXPORT_COLUMNS = [
    "name", "source", "reporting_year", "retrieval_date", "original_filename",
    "raw_record_count", "accepted_record_count", "notes", "created_at", "updated_at"
]

app.get("/api/export.csv", async (req, res) => {
    const conditions = []
    const params = []

    if (req.query.search) {
        conditions.push("(name LIKE ? OR source LIKE ? OR original_filename LIKE ? OR notes LIKE ?)")
        params.push(...Array(4).fill(`%${req.query.search}%`))
    }
    if (req.query.year) {
        const year = Number.parseInt(req.query.year, 10)
        if (!Number.isInteger(year)) return res.status(400).json({ error: "year must be an integer" })
        conditions.push("reporting_year = ?")
        params.push(year)
    }

    const sql = `
        SELECT ${EXPORT_COLUMNS.join(", ")}
        FROM \`${exportTable}\`
        ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
        ORDER BY reporting_year DESC, name ASC
    `

    res.attachment("datasets-export.csv")

    try {
        await pipeline(pool.query(sql, params).stream(), csvTransform(EXPORT_COLUMNS), res)
    } catch (error) {
        console.error("CSV export failed", error)
        if (!res.headersSent) res.status(500).json({ error: "Unable to export emissions data" })
        else res.destroy(error)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`)
})