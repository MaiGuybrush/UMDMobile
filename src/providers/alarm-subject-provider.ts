import { AlarmSubject } from '../models/alarm-subject';

import { Observable } from 'rxjs/Rx';

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export abstract class AlarmSubjectProvider  {
  abstract getAlarmSubjects() : Observable<AlarmSubject[]>;
}