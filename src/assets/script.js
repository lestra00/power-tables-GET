'use strict';

async function returnSheetJSON() {
  await tableau.extensions.initializeAsync();

  const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  const worksheet = worksheets.find(ws => ws.name === "Sheet 1");

  const dataTableReader = await worksheet.getSummaryDataReaderAsync();
  const columns = await worksheet.getSummaryColumnsInfoAsync();

  const columnsExport = columns.map(column => column.fieldName);
  const data = [];

  for (let currentPage = 0; currentPage < dataTableReader.pageCount; currentPage++) {
    const dataTablePage = await dataTableReader.getPageAsync(currentPage);

    dataTablePage.data.forEach((rowData) => {
      const obj = {};

      rowData.forEach((dataValue, index) => {
        const columnName = columnsExport[index];

        // Adjust the logic to match the correct column name with its value
        const columnNameFromDataValue = dataValue.columnName;
        const actualColumnName = columnsExport.find(name => name === columnNameFromDataValue);

        obj[actualColumnName] = dataValue.formattedValue;

        // Try to convert numeric values to numbers
        const numericValue = parseFloat(dataValue.formattedValue.replace(',', ''));
        if (!isNaN(numericValue)) {
          obj[actualColumnName] = numericValue;
        }
      });

      data.push(obj);
    });
  }

  return data;
}

async function main() {
  try {
    const result = await returnSheetJSON();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

window.returnSheetJSON = returnSheetJSON;

// Uncomment the line below if you want to run the main function immediately
// main();
