'use strict';

async function returnSheetJSON() {
  await tableau.extensions.initializeAsync();

  const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  const worksheet = worksheets.find(ws => ws.name === "Sheet 1");

  const dataTableReader = await worksheet.getSummaryDataReaderAsync();
  const columns = await worksheet.getSummaryColumnsInfoAsync();

  // Use the getColumnName method to retrieve the field name
  const getColumnFieldName = (columnIndex) => {
    return worksheet.getColumnNameAsync(columnIndex);
  };

  console.log('Columns:');
  columns.forEach(async (column, index) => {
    console.log(`Column ${index}:`, column);
    console.log('Column Name:', await getColumnFieldName(column.index));
  });

  const formattedPairs = [];

  for (let currentPage = 0; currentPage < dataTableReader.pageCount; currentPage++) {
    const dataTablePage = await dataTableReader.getPageAsync(currentPage);

    dataTablePage.data.forEach((rowData) => {
      const pair = {};

      rowData.forEach(async (dataValue) => {
        const columnIndex = dataValue.columnIndex;
        const columnName = await getColumnFieldName(columnIndex);

        if (columnName !== undefined) {
          pair[columnName] = dataValue.formattedValue;
        } else {
          console.log('Column name is undefined for dataValue:', dataValue);
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
