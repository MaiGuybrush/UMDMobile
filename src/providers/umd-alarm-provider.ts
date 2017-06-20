import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http'
import { Api } from './api'
import { Observable } from 'rxjs/Rx';
import { AlarmAction } from '../models/alarm-action';
import { AlarmActionSetting } from '../models/alarm-action-setting';
import { AlarmProvider } from './alarm-provider'
import { InterceptedHttp} from '../app/intercepted-http'

@Injectable()
export class UmdAlarmProvider implements AlarmProvider {
    constructor(public http: Http) {
    console.log('Hello Alarm Provider');
  }

  getAlarmActionSetting(alarmId:string) : Observable<AlarmActionSetting[]>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('GetAlarmIdActions');

     let body = {"AlarmId": `${alarmId}`};
     console.log('post start');
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).alarmAction
                    );
  }

  addAlarmAction(alarmId:string,createUserEmpId:string,alarmActions:AlarmAction[]) : Observable<boolean>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('SetAlarmAction');

     let body = {"AlarmID": `${alarmId}`,"CreateUserEmpId": `${createUserEmpId}`,"AlarmActions": Api.toPascal(alarmActions)};

     console.log('post start');
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).isSuccess
                    );
  }

  enableAlarmAction(alarmId:string,settingType:string,mailRecipient:string,mAppChatSn:string,groupId:number,enabled:boolean,empId:string) : Observable<boolean>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('EnableAlarmAction');

     let body = {"AlarmId": `${alarmId}`,"SettingType": `${settingType}`,"MailRecipient": `${mailRecipient}`,
                 "MAppChatSn": `${mAppChatSn}`,"GroupId": `${groupId}`,"Enabled": `${enabled}`,"EmpId": `${empId}`};

     console.log('post start');
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).isSuccess
                    );
  }

  deleteAlarmAction(alarmId:string,settingType:string,mailRecipient:string,mAppChatSn:string,empId:string) : Observable<boolean>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('DeleteAlarmAction');

     let body = {"AlarmId": `${alarmId}`,"SettingType": `${settingType}`,"MailRecipient": `${mailRecipient}`,"MAppChatSn": `${mAppChatSn}`,"EmpId": `${empId}`};

     console.log('post start');
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).isSuccess
                    );
  }


}


