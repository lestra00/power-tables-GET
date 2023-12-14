'use strict';

async function returnSheetJSON() {
  await tableau.extensions.initializeAsync();

  const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  const worksheet = worksheets.find(ws => ws.name === "Sheet 1");

  const dataTableReader = await worksheet.getSummaryDataReaderAsync();
  const columns = await worksheet.getSummaryColumnsInfoAsync();

  const formattedPairs = [];

  for (let currentPage = 0; currentPage < dataTableReader.pageCount; currentPage++) {
    const dataTablePage = await dataTableReader.getPageAsync(currentPage);

    dataTablePage.data.forEach((rowData) => {
      const pair = {};

      rowData.forEach((dataValue) => {
        const columnName = columns.find(column => column.index === dataValue.columnIndex).fieldName;

        console.log(`Column: ${columnName}, Value: ${dataValue.formattedValue}`);

        pair[columnName] = dataValue.formattedValue;

        // Try to convert numeric values to numbers
        const numericValue = parseFloat(dataValue.formattedValue.replace(',', ''));
        if (!isNaN(numericValue)) {
          pair[columnName] = numericValue;
        }
      });

      formattedPairs.push(pair);
    });
  }

  return formattedPairs;
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
