import { ChangeDetectorRef, Component } from '@angular/core';
import { IDisplayEmp } from '../../../models/Employee/Displayemployee.model';
import { Employeeservice } from '../../../services/employeeservice';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-emp-datails',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './emp-datails.html',
  styleUrl: './emp-datails.css'
})
export class EmpDatails {
  EmpID: string | null = '';
  employee: IDisplayEmp | undefined;
  constructor(public global: Global, private empservice: Employeeservice, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.EmpID = this.route.snapshot.paramMap.get('id');
    this.empservice.getEmpByID(this.EmpID).subscribe({
      next: (data) => {
        this.employee = data;
        console.log(` employee in api :${this.employee.fullName}`);
        this.cdr.detectChanges();
      }
    })

  }
  getInitials(name: string): string {
    if (!name) return '?';

    const parts = name.split(' ');
    const first = parts[0] ? parts[0].charAt(0) : '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';

    return (first + last).toUpperCase();
  }
  goBack() {
    this.global.goBack();
  }
}
