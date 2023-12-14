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

    dataTablePage.data.forEach((innerArray) => {
      const pair = innerArray.map((dataValue) => dataValue._formattedValue);
      formattedPairs.push(pair);
    });
  }

  const data = formattedPairs.map((pair) => {
    const obj = {};

    pair.forEach((dataValue, index) => {
      // Dynamically obtain the column name from dataValue
      const columnName = columns[index].fieldName;

      obj[columnName] = dataValue;

      // Try to convert numeric values to numbers
      const numericValue = parseFloat(dataValue.replace(',', ''));
      if (!isNaN(numericValue)) {
        obj[columnName] = numericValue;
      }
    });

    return obj;
  });

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
