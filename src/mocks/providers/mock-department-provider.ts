import { Injectable } from '@angular/core';
import { DepartmentProvider } from '../../providers/department-provider'
import { Department } from '../../models/department'
import { DEPARTMENTS } from '../DEPARTMENTS'
import { Observable } from 'rxjs/Rx'

/*
  Generated class for the EmployeeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MockDepartmentProvider implements DepartmentProvider {

  constructor() {
    console.log('Hello EmployeeProvider Provider');
  }
  
  getDepartments(pattern: string) : Observable<Department[]>
  {
    let deptIdPattern = new RegExp('^[0-9].*');
    let output: Department[] = [];
    let searchPattern = new RegExp('.*' + pattern + '.*', "i");
    if (!pattern || 0 === pattern.trim().length)
    {
      return Observable.from([DEPARTMENTS]);
    }
    if (deptIdPattern.test(pattern))
    {
        DEPARTMENTS.forEach(element => {
          if (searchPattern.test(element.deptId))
          {
            output.push(element);
          }
        });
    }
    else 
    {
        DEPARTMENTS.forEach(element => {
          if (searchPattern.test(element.deptName))
          {
            output.push(element);
          }
        });
    }
    
    return Observable.from([output]);
  }
}
