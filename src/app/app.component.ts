import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { CoreService } from './core/core.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [{ provide: EmployeeService, useClass: EmployeeService}],
  imports: [RouterOutlet, 
            MatToolbarModule, 
            MatIconModule, 
            MatButtonModule, 
            HttpClientModule, 
            MatTableModule,
            MatPaginatorModule,
            MatSortModule,
            MatInputModule,
            MatFormFieldModule,
            CommonModule,
            MatSnackBarModule,
            MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'crud_application';

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'job', 'gender', 'dob', 'age', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog, 
    private _empService: EmployeeService,
    private _coreService: CoreService
    ){}

    ngOnInit(): void{
      this.getEmployeeList();
    }

    openAddEditEmpForm(){
     const dialogRef = this._dialog.open(EmpAddEditComponent);
      dialogRef.afterClosed().subscribe({
        next: (val) =>{
          if(val){
            this.getEmployeeList(); // Refresh the list
          }
        }
      });
    }

    getEmployeeList(){
      this._empService.getEmployeeList().subscribe({
        next: (res) =>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: (err) =>{
          console.log(err);
        }
      })
    }
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    deleteEmployee(id: number){
      const confirmation = window.confirm(`Delete Employee Confirmation!\nAre you sure you want to delete employee with ID ${id}?`);
      if(confirmation){
      this._empService.deleteEmployee(id).subscribe({
        next: (res) =>{
          this._coreService.openSnackBar('Employee deleted successfully', 'Close');
          this.getEmployeeList(); // Refresh the list
        },
        error: (err) =>{
          console.log(err);
        }
      })
    }
    }

    openEditForm(data: any){
       const dialogRef = this._dialog.open(EmpAddEditComponent, {
        data,
       });
       
       dialogRef.afterClosed().subscribe({
        next: (val) =>{
          if(val){
            this.getEmployeeList(); // Refresh the list
          }
        }
      });
     }

     //calculate age
     calculateAge(birthDate: string): number | null {
      if (birthDate) {
        const dob = new Date(birthDate);
        const today = new Date();
        const ageDiff = today.getFullYear() - dob.getFullYear();
    
        // Check if birthday has occurred this year
        if (
          today.getMonth() < dob.getMonth() ||
          (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        ) {
          return ageDiff - 1;
        } else {
          return ageDiff;
        }
      } else {
        return null;
      }
    }
    
     //end
    }