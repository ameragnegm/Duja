import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employeeservice } from '../../../services/employeeservice';
import { Iemployee } from '../../../models/Employee/employee.model';
import { CommonModule, DatePipe } from '@angular/common';
import { IRole } from '../../../models/Employee/employeetitle.model';
import { ApiResponce } from '../../../models/Product/ApiResponce.model';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-emp-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './emp-form.html',
  providers: [DatePipe],
  styleUrl: './emp-form.css'
})
export class EmpForm implements OnInit {
  message!: ApiResponce;
  isEditable = false;
  Roles: IRole[] = [];
  EmpID: string | null = '';
  employee: Iemployee | undefined;
  employeeForm: FormGroup;
  constructor(private cdr: ChangeDetectorRef, public global: Global, private router: Router,
    private datePipe: DatePipe, private empservice: Employeeservice, private route: ActivatedRoute, private Form: FormBuilder) {
    const formattedToday = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.employeeForm = this.Form.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      address: [''],
      birthdate: [null, Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      roleID: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(1)]],
      hireDate: [formattedToday, Validators.required],
    })
  }
  private formatDataForForm(data: Iemployee) {
    return {
      ...data,
      hireDate: this.datePipe.transform(data.hireDate, 'yyyy-MM-dd'),
      birthdate: this.datePipe.transform(data.birthdate, 'yyyy-MM-dd')
    };
  } ngOnInit(): void {
    this.EmpID = this.route.snapshot.paramMap.get('id');

    this.empservice.getRoles().subscribe({
      next: (data) => {
        this.Roles = data;
        this.cdr.detectChanges();
        if (this.EmpID) {
          this.isEditable = true;
          // REMOVE PASSWORD VALIDATOR IN EDIT MODE
          this.employeeForm.get('password')?.clearValidators(); // Remove 'required'
          this.employeeForm.get('password')?.updateValueAndValidity(); // Update status

          this.empservice.getEmpByID(this.EmpID).subscribe({
            next: (emp) => {
              this.employee = emp;
              this.employeeForm.patchValue(this.formatDataForForm(emp));
              if (emp.roles && emp.roles.length > 0) {
                this.employeeForm.patchValue({
                  roleID: emp.roles[0].id
                });
                console.log(this.employeeForm.value);
              }
              this.cdr.detectChanges();
            },
            error: () => {
              this.isEditable = false;
            }
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    var confirmed = confirm("Save Data ?");

    if (confirmed) {

      var EmpNewData = this.employeeForm.value as Iemployee;
      console.log(EmpNewData);
      if (this.EmpID) {
        this.isEditable = true;
        this.empservice.UpdateEmployee(EmpNewData, this.EmpID).subscribe(
          {
            next: (data) => {
              this.message = data;
              this.isEditable = false;
              alert(this.message.message);
              this.router.navigate(['/manage/employees']);

            }
          }
        )
      } else {
        this.empservice.AddEmployee(EmpNewData).subscribe({
          next: (data) => {
            this.message = data;
            alert(this.message.message);
            this.router.navigate(['/manage/employees']);

          }
        })
      }

    } else {
      if (this.employee) {
        const formattedData = this.formatDataForForm(this.employee);
        this.employeeForm.reset(formattedData);
        this.cdr.detectChanges();
      }
    }


  }
  goBack(): void {
    this.global.goBack();
  }
}

