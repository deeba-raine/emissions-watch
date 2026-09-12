# Emissions Watch

A dynamic, interactive data platform that transforms raw EPA emissions data into actionable insights. Emissions Watch allows users to explore power-sector emissions trends, compare generating units, and visualize environmental performance over time.

---

## About the EPA & Power Plant Emissions

The Environmental Protection Agency (EPA) is an independent agency of the United States federal government with a mission to protect human health and the environment. To achieve this, the EPA utilizes legal, institutional, and research measures to monitor and regulate pollutants and chemicals produced by power plants. Additionally, the agency educates the public about the hazards of these pollutants and chemicals while regularly publishing open data based on its scientific research.

### How Power Plants Report Emissions

Power plants burn fuels to produce electricity. Here's how the emissions reporting system works:

- **EGU (Emissions Generating Unit)**: The machine at a power plant that actually generates electricity
- **Emissions produced**: When fuel is burned, it produces emissions — mainly sulfur dioxide (SO₂), nitrogen oxides (NOₓ), carbon dioxide (CO₂), and mercury
- **ECMPS**: The reporting system the EPA uses to collect emissions and operating data directly from power plant facilities
- **CAMPD**: EPA's public data warehouse that takes data collected through ECMPS and publishes it in a form the public can access, search, and analyze

### Data Source

This project uses unit-level annual emissions data accessed from the EPA's CAMPD (Clean Air Markets Program Data) website using their Custom Data Download tool. The dataset includes:

- **State**: Kentucky
- **Time Period**: 2015–2024 (10-year trend analysis)
- **Program**: Acid Rain Program
- **Data Type**: Unit-level annual emissions
- **Selection Rationale**: Kentucky was selected as the analysis state because it is where the project creator resides, making it a natural and relevant choice for this analysis. The annual report period from 2015–2024 was chosen to build a multi-year time series, providing a comprehensive and recent dataset for identifying trends and extracting meaningful insights into the state's power-sector emissions performance.

---

## The Problem: Limitations of EPA's Data Platform

The U.S. Environmental Protection Agency (EPA) provides public access to power-sector emissions data through the CAMPD platform, but its delivery mechanism has significant limitations in scope:

- Users can only download **static, unstructured CSV or JSON files**
- **No native query capability** — users cannot search or filter data across facilities
- **No comparison tools** — generating units cannot be compared side by side
- **No visualization** — trends must be manually extracted from flat datasets
- Users are left to manually parse large, flat spreadsheets to extract meaningful insights

---

## What Emissions Watch Solves

Emissions Watch addresses these limitations by transforming raw EPA exports into a **dynamic, interactive data platform**:

✓ **Structured relational database** — links facilities, their generating units, and each unit's annual emissions records — rather than leaving them scattered across one flat spreadsheet  
✓ **Advanced filtering & search** — filter and search by state, fuel type, reporting year, and emissions thresholds  
✓ **Unit comparison** — compare units against one another to identify patterns and performance differences  
✓ **Environmental performance indicators** — view calculated environmental performance indicators instead of raw tonnage figures alone  
✓ **Interactive visualizations** — interactive charts allow users to see emissions trends over time  
✓ **Export functionality** — built-in export feature lets users download their filtered results as CSV files for further use outside the platform  

---

## Analysis Features

The platform provides comprehensive emissions analysis including:

- **Emissions Trends (2015–2024)**  
  Year-over-year CO₂, SO₂, and NOₓ totals; overall direction; sharp year-to-year shifts

- **Fuel Comparison**  
  Average emissions rate by fuel type; how the fuel mix shifted over time

- **Efficiency vs. Emissions**  
  Heat rate per unit, checked against emissions intensity

- **Rankings**  
  Top and bottom emitters; most-improved units

- **Control Impact**  
  Emissions rate before/after control installation; controlled vs. uncontrolled unit comparison

- **Key Findings**  
  A short summary tying the trends together

---

## Project Setup