import { parse } from "@jlarky/csv-parse";
import orderBy from 'https://esm.sh/lodash@4.17.21/orderBy'

type Row = {
  "SOS Assigned Filer ID Number": string;
  "Filer Name": string;
  "Responsible Officer": string;
  "Filer Type": string;
  "Form Number": string;
  "Form Period Beginning Date": string;
  "Form Period Ending Date": string;
  "Beginning Balance": number;
  "Current Balance": number;
};

function parseDate<String>(str: string) {
  const [mm, dd, yy] = str.split("/");
  if (!dd) return null
  let y = yy.length === 4 ? yy : `20${yy}`
  return `${y}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function parseDollar<Number>(str: string) {
  const s = str.replaceAll("$", "").replaceAll(",", "");
  return +s;
}

const csvFile = await Deno.readTextFile("outstanding-fines-list.csv");
const [firstRow, ...rest] = csvFile.split("\n");
const match = firstRow.match(/Updated\s+(\d+\/\d+\/\d+)/);
const updatedAt = parseDate(match[1]);
const csv = await parse(rest.join("\n"), { columns: true });
const transformed:Row[] = csv.records.map((row) => {
  return {
    "SOS Assigned Filer ID Number": row["SOS Assigned Filer ID Number"],
    "Filer Name": row["Filer Name"].trim(),
    "Responsible Officer": row["Responsible Officer"].trim(),
    "Filer Type": row["Filer Type"],
    "Form Number": row["Form Number"],
    "Form Period Beginning Date": parseDate(
      row["Form \nPeriod Beginning Date"],
    ),
    "Form Period Ending Date": parseDate(row["Form\nPeriod Ending\nDate"]),
    "Beginning Balance": parseDollar(row["Beginning Balance"]),
    "Current Balance": parseDollar(row["Current Balance"]),
  };
});
const sum = transformed.reduce((accum, next) => {
  return accum + next["Current Balance"]
}, 0)
const sorted:Row[] = orderBy(transformed, ['Filer Name', 'Form Period Ending Date', 'Current Balance'], ['asc', 'asc', 'desc'])
const toWrite = JSON.stringify({ sorted, updatedAt }, null, 2);
await Deno.writeTextFile('outstanding-fines.json', toWrite)

const readme = await Deno.readTextFile('README.md')
const updated = readme.replace(
  /\*\*Total outstanding fines\:\*\*\s\$[\d\,\.]+/,
  `**Total outstanding fines:** $${sum.toLocaleString('en-US', { style: 'currency', currency: "USD" })}`
).replace(
  /\_Last updated on [\d\-]+_/,
  `_Last updated on ${updatedAt}_`
)
await Deno.writeTextFile('README.md', updated)