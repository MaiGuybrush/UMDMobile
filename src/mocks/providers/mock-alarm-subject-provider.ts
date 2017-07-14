import { Injectable } from '@angular/core';
import { AlarmSubject } from '../../models/alarm-subject';
import { ALARMSUBJECTS } from '../ALARM-SUBJECTS';
import { AlarmSubjectProvider } from '../../providers/alarm-subject-provider'

import { Observable } from 'rxjs/Rx';

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MockAlarmSubjectProvider implements AlarmSubjectProvider{
 
  getAlarmSubjects() : Observable<AlarmSubject[]>
  {
    return Observable.from([ALARMSUBJECTS]);
  }

}
