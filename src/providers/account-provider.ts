import { InxAccount } from '../models/inx-account';
import { Observable } from 'rxjs/Observable'


/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export abstract class AccountProvider  {
  abstract getInxAccount() : InxAccount;
  abstract getUserInfo(): Observable<InxAccount>;
  // abstract updateUserInfo(empId:string, deviceToken: string): Observable<boolean>;
}