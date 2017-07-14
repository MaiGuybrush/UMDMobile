import { Injectable } from '@angular/core'
import { GeneralDataProvider } from '../../providers/general-data-provider'
import { ALARMTYPES } from '../ALARMTYPES'
import { Observable } from 'rxjs/Rx'


import 'rxjs/add/operator/map'

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MockGeneralDataProvider implements GeneralDataProvider {
  constructor() {
  }
  
  // getDepartments() : Observable<string[]>
  // {
  //   return Observable.from([DEPARTMENTS]);
  // }

  getAlarmTypes() : Observable<string[]>
  {
    return Observable.from([ALARMTYPES]);
  }
}