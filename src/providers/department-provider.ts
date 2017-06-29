import { Department } from '../models/department';
import { Observable } from 'rxjs/Rx'
/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export abstract class DepartmentProvider  {
  abstract getDepartments(pattern: string, queryPage: number) : Observable<Department[]>;
}