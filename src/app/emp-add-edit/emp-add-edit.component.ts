import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { Inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { CoreService } from '../core/core.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-emp-add-edit',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    // { provide: MatDialogRef, useValue: {} }, // Provide MatDialogRef
    // { provide: MAT_DIALOG_DATA, useValue: {} }, // Provide MAT_DIALOG_DATA
    { provide: EmployeeService, useClass: EmployeeService}
  ],
  imports: [MatDialogModule, 
            MatButtonModule, 
            MatFormFieldModule, 
            MatInputModule, 
            MatDatepickerModule,
            MatNativeDateModule,
            MatIconModule,
            MatSelectModule,
            ReactiveFormsModule,
            HttpClientModule,
            MatSnackBarModule,
            CommonModule,
            MatError],
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.css']
})

export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;

  constructor(
    private _fb: FormBuilder, 
    private _empService: EmployeeService, 
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
    ){
    this.empForm = this._fb.group({
      firstName: '',
      lastName: '',
      job: '',
      gender: '',
      dob: '',
    });
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }


  onFormSubmit(){
    if(this.empForm.valid){
      if(this.data){
        this._empService.updateEmployee(this.data.id, this.empForm.value).subscribe({
          next: (val: any) =>{
            this._coreService.openSnackBar('Employee updated successfully', 'Close');
            this._dialogRef.close(true);
          },
          error: (err: any) =>{
            console.error(err);
          }
        });

      }else{
      this._empService.addEmployee(this.empForm.value).subscribe({
              next: (val: any) =>{
                this._coreService.openSnackBar('Employee added successfully');
                this._dialogRef.close(true);
              },
              error: (err: any) =>{
                console.error(err);
              }
            });
      }
     
    }
  }
}
