'use strict';

async function returnSheetJSON() {
  await tableau.extensions.initializeAsync();

  const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  const worksheet = worksheets.find(ws => ws.name === "Sheet 1");

  const dataTableReader = await worksheet.getSummaryDataReaderAsync();
  const columns = await worksheet.getSummaryColumnsInfoAsync();

  console.log('Columns:');
  columns.forEach((column, index) => {
    console.log(`Column ${index}:`, column);
  });

  const formattedPairs = [];

  for (let currentPage = 0; currentPage < dataTableReader.pageCount; currentPage++) {
    const dataTablePage = await dataTableReader.getPageAsync(currentPage);

    dataTablePage.data.forEach((rowData) => {
      const pair = {};

      rowData.forEach((dataValue) => {
        const columnIndex = dataValue.columnIndex;
        const columnInfo = columns.find(column => column.index === columnIndex);

        if (columnInfo) {
          const columnName = columnInfo._fieldName; // Use _fieldName property

          if (columnName !== undefined) {
            pair[columnName] = dataValue.formattedValue;
          } else {
            console.log('Column name is undefined for dataValue:', dataValue);
          }
        } else {
          console.log('Column info is undefined for columnIndex:', columnIndex);
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
