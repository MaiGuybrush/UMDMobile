import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http'
import { Api } from './api'
import { Observable } from 'rxjs/Rx';
import { Subscribe } from '../models/subscribe';
import { SubscribeCancelResult } from '../models/subscribe-cancel-result';
import { AlarmActionSetting } from '../models/alarm-action-setting';
import { SubscriptionProvider } from './subscription-provider';
import { InterceptedHttp} from '../app/intercepted-http'

@Injectable()
export class UmdSubscriptionProvider implements SubscriptionProvider {
    constructor(public http: Http) {
    console.log('Hello Subscription Provider');
  }


  getSubscribed(empId:string, alarmtype?:string, pattern?: string) : Observable<Subscribe[]>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('GetSubscribedAlarmIdData');

     let body = {"EmpId": `${empId}`, "AlarmType": `${alarmtype}`, "Keyword": `${pattern}`};
     console.log('post start');
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).alarmIdList
                    );
  }

  getNotSubscribed(empId:string, alarmtype?:string, pattern?: string) : Observable<Subscribe[]>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('GetNotSubscribeAlarmIdData');

     let body = {"EmpId": `${empId}`, "AlarmType": `${alarmtype}`, "Keyword": `${pattern}`};
     console.log('post start');
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).alarmIdList
                    );
  }

  cancelSubscribeAlarm(alarmIds:string[], empId:string) : Observable<SubscribeCancelResult>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('CancelSubscribeAlarm');

     let body = {"AlarmIds": alarmIds, "EmpId": `${empId}`};
     console.log('post start');
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json())
                    );
  }

  subscribeAlarm(alarmIds:string[], actionType:number, actionValue:string, chatName:string, empId:string) : Observable<boolean>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('SubscribeAlarm');

     let body = {"AlarmIds": alarmIds, "ActionType": `${actionType}`, "ActionValue": `${actionValue}`, "ChatName": `${chatName}`, "EmpId": `${empId}`};
     console.log('post start');
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).isSuccess
                    );
  }

}

