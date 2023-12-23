//'use strict'

import { Component, AfterViewInit,  ViewChild, OnInit, ElementRef} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgFor} from '@angular/common';
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { __await } from 'tslib';




declare const returnSheetJSON: () => any[] | PromiseLike<any[]>;
const data2  =  returnSheetJSON();



 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent {
[x: string]: any;
  title = 'PowerTablesV0.2';
 
  dataSource: MatTableDataSource <any> = new MatTableDataSource();

  

  constructor(   ) {
    //console.log(data2);
    //this.dataSource = new MatTableDataSource (ELEMENT_DATA);
        //this.dataSource = this.loadTableauData();
        //this.dataSource = new MatTableDataSource();
    
  }
  
  
  columnNames: string[] = [];
  displayedColumns: string[] = [];
  columnFilters: { [key: string]: string } = {};
  @ViewChild('input') input: ElementRef = <ElementRef>{};
  
  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  @ViewChild(MatSort) sort: MatSort = <MatSort>{};
  
  async ngOnInit() {
  //console.log(this.dataSource.data);
  console.log("second try");
   await this.getWorksheetData();
   //console.log(this.dataSource.data);
   this.displayedColumns = this.columnNames;
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
   
  }

 async getWorksheetData() {
  try {
    // Call the existing JavaScript function
    const result = await returnSheetJSON();
    //this.columnNames = result.columnNames;
    // Check if the result is an array
    if (Array.isArray(result)) {
      // Extract column names
         //this.columnNames = Object.keys(result[0] || {});
      this.columnNames = result[0];
      // Update the MatTableDataSource
      this.dataSource = new MatTableDataSource(result[1]);
  
      //console.log('Data assigned to dataSource:', result);
     // console.log('Column names:', this.columnNames);
     // console.log(this.dataSource);
    } else {
      console.error('Error: The result is not an array.', result);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


getColumnNames(element: any): string[] {
  // Assuming element is an object
  return Object.keys(element);
}



drop(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
}



  columns: any[] = [];
  
 

  extractColumnValues2(data:Array<any>, columnName: string) {
    if (!data || !Array.isArray(data) || data.length === 0 || !columnName) {
      return [];
    }
    
    return data.map((item) => item[columnName]);
  }
  assignColumns(){

   for (const i of this.displayedColumns) {
    console.log(i);
    

    const obj : {columnDef:any,cell:any} = {columnDef: i, cell: (element: any) => element[i] };
    console.log(obj);
    this.columns.push(obj);
   }
    
  }



  


    //apply mat table filter
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  applyFilter(event: Event, columnName: string) {
    const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.columnFilters[columnName] = inputValue;

    const filters: { [key: string]: (value: any) => boolean } = {};

    // Create filters for each column
    this.columnNames.forEach(column => {
      const filterValue = this.columnFilters[column] || '';
      filters[column] = (value: any) =>
        value[column].toString().toLowerCase().includes(filterValue);
    });

    // Apply filters
    this.dataSource.filterPredicate = (data, filter) => {
      const values = Object.values(filters);
      return values.length === 0 || values.every(filterFunction => filterFunction(data));
    };

    // Trigger filtering
    this.dataSource.filter = 'triggerFilter';
  }








}


  
  


