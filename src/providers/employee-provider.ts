import { Employee } from '../models/employee';
import { Observable } from 'rxjs/Rx'
/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export abstract class EmployeeProvider  {
  abstract getEmployees(empID: string, pattern: string, queryPage: number) : Observable<Employee[]>
  abstract updateEmployeeInfo(empId:string, deviceToken: string,uuId:string,manufacturer:string,model:string,universallyId:string,version:string): Observable<boolean>;
}