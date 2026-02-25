import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponce } from '../models/Product/ApiResponce.model';
import { IRole} from '../models/Employee/employeetitle.model';
import { Iemployee } from '../models/Employee/employee.model';
import { IDisplayEmp } from '../models/Employee/Displayemployee.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Employeeservice {
  /**
   *
   */
  constructor(private http : HttpClient) {
    
  }
  empURL : string = environment.apiUrl + "/employee"; 
  getRoles() : Observable<IRole[]>{
    return this.http.get<IRole[]>(`${this.empURL}/Roles`);
  }
  getRolesById(id : string ) : Observable<IRole>{
    return this.http.get<IRole>(`${this.empURL}/Roles/${id}`);
  }
  getAllEmps() : Observable<IDisplayEmp[]>{
    return this.http.get<IDisplayEmp[]>(this.empURL) ;
  }
  getEmpByID(id : string | null) : Observable<IDisplayEmp>{
    return this.http.get<IDisplayEmp>(`${this.empURL}/${id}`);
  }
  AddEmployee(emp : Iemployee ): Observable<ApiResponce>{
    return this.http.post<ApiResponce>(`${this.empURL}`,emp);
  }
  UpdateEmployee(emp : Iemployee , id : string  ): Observable<ApiResponce>{
    return this.http.put<ApiResponce>(`${this.empURL}/${id}`,emp);
  }
  DeleteEmployee(id : string): Observable<ApiResponce>{
      return this.http.delete<ApiResponce>(`${this.empURL}/${id}`) ;
     }
}
