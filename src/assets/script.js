'use strict';

async function returnSheetJSON() {
  await tableau.extensions.initializeAsync();

  const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  const worksheet = worksheets.find(ws => ws.name === "Sheet 1");

  const dataTableReader = await worksheet.getSummaryDataReaderAsync();
  const columns = await dataTableReader.getColumnsAsync();

  const columnsExport = columns.map(column => column.getFieldName());
  const data = [];

  for (let currentPage = 0; currentPage < dataTableReader.pageCount; currentPage++) {
    const dataTablePage = await dataTableReader.getPageAsync(currentPage);

    dataTablePage.data.forEach((rowData) => {
      const obj = {};

      rowData.forEach((dataValue, index) => {
        const columnName = columnsExport[index];

        obj[columnName] = dataValue.formattedValue;

        // Try to convert numeric values to numbers
        const numericValue = parseFloat(dataValue.formattedValue.replace(',', ''));
        if (!isNaN(numericValue)) {
          obj[columnName] = numericValue;
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
