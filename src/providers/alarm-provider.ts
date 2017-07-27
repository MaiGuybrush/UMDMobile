import { AlarmAction } from '../models/alarm-action';
import { AlarmActionSetting } from '../models/alarm-action-setting';


import { Observable } from 'rxjs/Rx';

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export abstract class AlarmProvider  {
    abstract getAlarmActionSetting(alarmId:string) : Observable<AlarmActionSetting[]>;
    abstract addAlarmAction(alarmId:string,createUserEmpId:string,alarmActions:AlarmAction[]) : Observable<boolean>;
    abstract enableAlarmAction(alarmId:string,settingType:string,mailRecipient:string,mAppChatSn:string,groupId:number,enabled:boolean,empId:string) : Observable<boolean>;
    abstract deleteAlarmAction(alarmId:string,settingType:string,mailRecipient:string,mAppChatSn:string,empId:string) : Observable<boolean>;
}