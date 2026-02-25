import { IRole } from './../../../models/Employee/employeetitle.model';
import { IDisplayEmp } from './../../../models/Employee/Displayemployee.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Employeeservice } from './../../../services/employeeservice';
@Component({
  selector: 'app-emp-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './emp-list.html',
  styleUrl: './emp-list.css'
})
export class EmpList implements OnInit {
  isloading = true;
  employees: IDisplayEmp[] = [];
  searchTerm: string = '';
  filteredEmps !: IDisplayEmp[];
  emp: IDisplayEmp | undefined;
  message: string = '';
  Roles: IRole[] = [];
  selectedRoleId: string = 'All';
  selectedRole!: IRole;
  constructor(private empservice: Employeeservice, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.empservice.getAllEmps().subscribe({
      next: (data) => {
        this.employees = data;
        console.log(this.employees);
        this.filteredEmps = this.employees;
        this.isloading = false;
        this.cdr.detectChanges();
      }
    });
    this.empservice.getRoles().subscribe({
      next: (data) => {
        this.Roles = data;
        console.log(this.Roles);
        this.cdr.detectChanges();
      }
    });
  }
  onDelete(id: number) {
    var confirmed = confirm("Are you sure to Delete this Employee ? ")
    if (confirmed) {
      this.empservice.DeleteEmployee(String(id)).subscribe({
        next: (data) => {
          this.message = data.message;
          console.log(this.message.toString());
          this.employees = this.employees.filter(e => e.id !== id);
          alert(this.message);
          this.router.navigate(['/manage/employees']);
          this.cdr.detectChanges();
        }
      });

    }
  }
  filter() {
    let TempEmps = this.employees;

    if (this.selectedRoleId && this.selectedRoleId !== 'All') {
      TempEmps = TempEmps.filter(employee => {
        const rolesList = employee.roles || [];
        return rolesList.some(role => role.id == this.selectedRoleId);
      });
    }
    console.log(TempEmps)
    if (this.searchTerm) {
      TempEmps = TempEmps.filter(e => e.fullName.toLocaleLowerCase().includes(this.searchTerm) || e.email.toLocaleLowerCase().includes(this.searchTerm))
    }
    this.filteredEmps = TempEmps;
  }
  onRolesfilter(event: Event) {
    var selectoption = event.target as HTMLSelectElement;
    this.selectedRoleId = selectoption.value;
    this.filter();
  }
  onSearch(event: Event) {
    var input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.filter();
  }
}

function forEach(p0: boolean) {
  throw new Error('Function not implemented.');
}
