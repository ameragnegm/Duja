import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
let EmpList = class EmpList {
    empservice;
    cdr;
    router;
    isloading = true;
    employees = [];
    searchTerm = '';
    filteredEmps;
    emp;
    message = '';
    Roles = [];
    selectedRoleId = 'All';
    selectedRole;
    constructor(empservice, cdr, router) {
        this.empservice = empservice;
        this.cdr = cdr;
        this.router = router;
    }
    ngOnInit() {
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
    onDelete(id) {
        var confirmed = confirm("Are you sure to Delete this Employee ? ");
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
        console.log(TempEmps);
        if (this.searchTerm) {
            TempEmps = TempEmps.filter(e => e.fullName.toLocaleLowerCase().includes(this.searchTerm) || e.email.toLocaleLowerCase().includes(this.searchTerm));
        }
        this.filteredEmps = TempEmps;
    }
    onRolesfilter(event) {
        var selectoption = event.target;
        this.selectedRoleId = selectoption.value;
        this.filter();
    }
    onSearch(event) {
        var input = event.target;
        this.searchTerm = input.value;
        this.filter();
    }
};
EmpList = __decorate([
    Component({
        selector: 'app-emp-list',
        standalone: true,
        imports: [
            CommonModule,
            RouterLink
        ],
        templateUrl: './emp-list.html',
        styleUrl: './emp-list.css'
    })
], EmpList);
export { EmpList };
function forEach(p0) {
    throw new Error('Function not implemented.');
}
