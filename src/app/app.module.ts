import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as Tableau from '../../node_modules/@tableau/extensions-api-types' 
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule, 
    MatSortModule,
    CdkDrag,
    CdkDropList, 
  
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
