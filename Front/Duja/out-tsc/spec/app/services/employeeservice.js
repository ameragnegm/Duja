import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let Employeeservice = class Employeeservice {
    http;
    /**
     *
     */
    constructor(http) {
        this.http = http;
    }
    empURL = environment.apiUrl + "/employee";
    getRoles() {
        return this.http.get(`${this.empURL}/Roles`);
    }
    getRolesById(id) {
        return this.http.get(`${this.empURL}/Roles/${id}`);
    }
    getAllEmps() {
        return this.http.get(this.empURL);
    }
    getEmpByID(id) {
        return this.http.get(`${this.empURL}/${id}`);
    }
    AddEmployee(emp) {
        return this.http.post(`${this.empURL}`, emp);
    }
    UpdateEmployee(emp, id) {
        return this.http.put(`${this.empURL}/${id}`, emp);
    }
    DeleteEmployee(id) {
        return this.http.delete(`${this.empURL}/${id}`);
    }
};
Employeeservice = __decorate([
    Injectable({
        providedIn: 'root'
    })
], Employeeservice);
export { Employeeservice };
