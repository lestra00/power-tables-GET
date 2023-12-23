'use strict';

async function returnSheetJSON() {
  await tableau.extensions.initializeAsync();

  const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  const worksheet = worksheets.find(ws => ws.name === "Sheet 1");

  const rawData = await worksheet.getSummaryDataAsync();
  
  const columnNames = rawData.columns.map(column => column.fieldName);

  const result = [];

  rawData.data.map(row => {
    const rowData = [];
    row.forEach((value, index) => {
      const cellColumnName = columnNames[index];
     //var elm = {columnName: cellColumnName, columnValue: value._formattedValue};
     var elm = {[cellColumnName]: value._formattedValue};
     rowData.push(elm);
    });

    let mergedObject = rowData.reduce((accumulator, currentObject) => {
      return { ...accumulator, ...currentObject };
    }, {});
    console.log(mergedObject);
    result.push(mergedObject);
    
  });
 
  
  console.log(result);

  return [columnNames, result];


async function main() {
  try {
    const result = await returnSheetJSON();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

}
window.returnSheetJSON = returnSheetJSON;  
