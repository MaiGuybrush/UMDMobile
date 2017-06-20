import { Subscribe } from '../models/subscribe';
import { SubscribeCancelResult } from '../models/subscribe-cancel-result';
import { AlarmActionSetting } from '../models/alarm-action-setting';
import { Observable } from 'rxjs/Rx'

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export abstract class SubscriptionProvider  {
  abstract getSubscribed(empId:string, alarmtype?:string, pattern?: string) : Observable<Subscribe[]>;
  abstract getNotSubscribed(empId:string, alarmtype?:string, pattern?: string) : Observable<Subscribe[]>;
  abstract cancelSubscribeAlarm(alarmIds:string[], empId:string) : Observable<SubscribeCancelResult>;
  abstract subscribeAlarm(alarmIds:string[], actionType:number, actionValue:string, chatName:string, empId:string) : Observable<boolean>;
}