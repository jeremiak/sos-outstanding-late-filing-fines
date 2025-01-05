# California Secretary of State Outstanding Fines for Late Filings

**Total outstanding fines:** $2,830,869.30








_Last updated on 2024-11-01_

The California Secretary of State (SoS) publishes an Excel spreadsheet ([on this webpage](https://www.sos.ca.gov/campaign-lobbying/cal-access-resources/outstanding-fines-late-filings)) with data about "late filers with unpaid fines who were sent fine notices from the Secretary of State's office". The office updates the file monthly.

The problem with that file is that:
1. It's an Excel file which means it's harder to open than a `.csv` or a `.json` text file.
2. It has an extra header row that contains the date of the last update and prevents proper column parsing.
3. All the columns are strings which means you can't just add up the columns to get a total amount.

This scraper converts the Excel file into a JSON file with a stable sort order so we can see when things change.

[![Update](https://github.com/jeremiak/sos-outstanding-late-filing-fines/actions/workflows/run.yml/badge.svg)](https://github.com/jeremiak/sos-outstanding-late-filing-fines/actions/workflows/run.yml)

## Data dictionary

These columns should match the `.xls` file available for download on the SoS website. Dates have been standardized to be `YYYY-MM-DD` and dollar amounts have been converted to numbers.

Column | Description
-- | --
SOS Assigned Filer ID Number | The FPPC assigned ID; you can use this in Cal-Access
Filer Name | The name of the filer
Responsible Officer | The filing officer if the filer is an organization
Filer Type | The type of filer
Form Number | The FPPC [form number](https://www.fppc.ca.gov/forms.html) of the late filing
Form Period Beginning Date | The first date of the late filing's filing period 
Form Period Ending Date | The last date of the late filing's filing period 
Beginning Balance | 
Current Balance | Current dollar value of fine
