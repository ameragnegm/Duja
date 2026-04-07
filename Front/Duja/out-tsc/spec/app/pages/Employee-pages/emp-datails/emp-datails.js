import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
let EmpDatails = class EmpDatails {
    global;
    empservice;
    route;
    cdr;
    EmpID = '';
    employee;
    constructor(global, empservice, route, cdr) {
        this.global = global;
        this.empservice = empservice;
        this.route = route;
        this.cdr = cdr;
    }
    ngOnInit() {
        this.EmpID = this.route.snapshot.paramMap.get('id');
        this.empservice.getEmpByID(this.EmpID).subscribe({
            next: (data) => {
                this.employee = data;
                console.log(` employee in api :${this.employee.fullName}`);
                this.cdr.detectChanges();
            }
        });
    }
    getInitials(name) {
        if (!name)
            return '?';
        const parts = name.split(' ');
        const first = parts[0] ? parts[0].charAt(0) : '';
        const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
        return (first + last).toUpperCase();
    }
    goBack() {
        this.global.goBack();
    }
};
EmpDatails = __decorate([
    Component({
        selector: 'app-emp-datails',
        imports: [CurrencyPipe, DatePipe, RouterLink],
        templateUrl: './emp-datails.html',
        styleUrl: './emp-datails.css'
    })
], EmpDatails);
export { EmpDatails };
