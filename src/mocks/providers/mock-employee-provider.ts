import { Injectable } from '@angular/core';
import { EmployeeProvider } from '../../providers/employee-provider'
import { Employee } from '../../models/employee'
import { EMPLOYEES } from '../EMPLOYEES'
import { Observable } from 'rxjs/Rx'

/*
  Generated class for the EmployeeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MockEmployeeProvider implements EmployeeProvider {

  constructor() {
    console.log('Hello EmployeeProvider Provider');
  }
  
  updateEmployeeInfo(empId:string, deviceToken: string,uuId:string,manufacturer:string,model:string,universallyId:string,version:string): Observable<boolean>{
    return Observable.from([true]);        
  }


  getEmployees(empID: string, pattern: string, queryPage: number) : Observable<Employee[]>
  {
    let comidPattern = new RegExp('^[a-z].*', "i");
    let empnoPattern = new RegExp('^[0-9].*');
    let output: Employee[] = [];
    let searchPattern = new RegExp('.*' + pattern + '.*', "i");
    if (!pattern || 0 === pattern.trim().length)
    {
      return Observable.from([EMPLOYEES]);
    }
    if (comidPattern.test(pattern))
    {
        EMPLOYEES.forEach(element => {
          if (searchPattern.test(element.adId))
          {
            output.push(element);
          }
        });
    }
    else if (empnoPattern.test(pattern))
    {
        EMPLOYEES.forEach(element => {
          if (searchPattern.test(element.empId))
          {
            output.push(element);
          }
        });
    }
    else 
    {
        EMPLOYEES.forEach(element => {
          if (searchPattern.test(element.name))
          {
            output.push(element);
          }
        });
    }
    
    return Observable.from([output]);
  }
}
