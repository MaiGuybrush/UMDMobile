import { Injectable } from '@angular/core'
import { Platform } from 'ionic-angular'
import { Http, Headers, Response, RequestOptions } from '@angular/http'
import { Push, PushObject, PushOptions, RegistrationEventResponse } from '@ionic-native/push';
import { Observable } from 'rxjs/Rx'
import { PureHttp } from '../app/pure-http'
import { PushProvider } from './push-provider'
import { Message } from '../models/message'
import { DeviceInfo } from '../models/device-info'
import { MessageProvider } from './message-provider'
import { AccountProvider } from './account-provider'
import { EmployeeProvider } from './employee-provider'
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { InxAccount } from '../models/inx-account'
import { Device } from '@ionic-native/Device'
// import * as moment from 'moment'
declare var window;

@Injectable()
export class FcmPushProvider implements PushProvider {
    static pushObject: PushObject;
    fcmUrl = "https://fcm.googleapis.com/fcm/send";
    fcmAthorizationKey = "AAAAwkeVcOk:APA91bGDRCbVZ06C-5c3yw1MHsby4Q2siEeXWYQfJzTyegeJr091nsSC1Efau293Kz0zwidUEaLm8Rsj3RMT0EpsVEQRoabkirl-loIPEfD2sfabMu1ETq8AJfMYPDavhyHM7cp956vO"
    
    constructor(public platform: Platform, public pureHttp: PureHttp
        , public messageProvider: MessageProvider, public push: Push
        , public accountProvider: AccountProvider, public uniqueDeviceID:UniqueDeviceID
        , public employeeProvider: EmployeeProvider
        , public device : Device) {

    }

    pushReadNotification(message: Message, name: string) : Observable<boolean>
    {
        ///TODO: complete this job
        // let options = new RequestOptions();
        // options.headers = new Headers();
        // options.headers.set("Content-Type", "application/json")
        // options.headers.set("Authorization", "key=" + this.fcmAthorizationKey)
        // return this.pureHttp.post("https://fcm.googleapis.com/fcm/send", 
        // { 
        //     "notification": {
        //         "title": "MessageRead",
        //         "data": { 
        //             "id": message.id,
        //             "name": name
        //         }
        //     },
        //     "to" : "/topics/" + message.uuid
        // }, options).map(m => m.status === 200);
        return Observable.from([true]);
    }
    
    pushNotificationHandler(data: any) {
        if (data.title == "MessageRead")
        {
            this.messageProvider
            .updateReadCount(data.additionalData.id, data.additionalData.name).subscribe(
                m => console.log("updateReadCount successfully!"),
                e => console.log("updateReadCount failed!")
            );
        }
        else
        {
            let m = new Message();
            m.id = data.additionalData.tstamp//data.additionalData["google.message_id"];
            m.occurDT = data.additionalData.occurDT;
            m.alarmID = data.title;
            m.eqptID = data.additionalData.eqptID;
            m.alarmMessage = data.message;
            m.alarmType = data.additionalData.alarmType;
            // m.description = data.additionalData.description;
            m.description = data.additionalData.description.toString().charAt(0) === '~' ? data.additionalData.description.toString().substring(1) : data.additionalData.description;
            m.uuid = data.additionalData.uuid;


            console.log("data:", data);

            if(this.platform.is('ios')){        
                FcmPushProvider.pushObject.finish().then(()=>{
                    console.log('Processing ios of push data is finished');
                })
            }


            //if user using app and push notification comes
            if (data.additionalData.foreground) {
                // if application open
                console.log("Push notification app open " + m.alarmID)
                this.messageProvider.addMessage(m).subscribe(m => {
                    console.log(`Message ${m.alarmID} saved app open `)
                });
            } else {
                if (data.additionalData.coldstart) {
                    console.log("Push notification background ");
                    this.messageProvider.addMessage(m).subscribe(m => {
                        console.log(`Message ${m.alarmID} saved app open `)
                    });
                }else{
                    if(this.platform.is('ios')) {
                        this.messageProvider.addMessage(m).subscribe(m => {
                            console.log(`Message ${m.alarmID} saved app open `)
                        });                        
                    }
                    else 
                    {
                        console.log("Tap Push notification bar background " );
                        window.location.replace("#/app/src/pages/meeeages/messages"); 
                    }
                }
            }
        }
    }

    pushInit()
    {
        var me = this;
        const options: PushOptions = {

            android: {
                senderID: '834424631529',
                icon: "alarm",
                iconColor: "red"
            //    topics: ['sample-topic','dally-topic']
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'true',
            },
            windows: {}
        };
        FcmPushProvider.pushObject = this.push.init(options);
        FcmPushProvider.pushObject.on('notification').subscribe((data: any) => {
            console.log('notification:',data);
            me.pushNotificationHandler(data);
        });
        FcmPushProvider.pushObject.on('error').subscribe(error => console.error('Error with Push plugin err=' + error));
        

        return FcmPushProvider.pushObject.on('registration').subscribe(m => {
            var registrationInfo = m;
            this.getDeviceInfo().subscribe(d=>{                
                console.log("updateDeviceInfo [" + JSON.stringify(d) + "]");  
                
                    this.getUniqueDeviceID().subscribe( uuid => {
                        this.getUserInfo().subscribe(m => {
                            var user = m;    
                            if (registrationInfo && registrationInfo.registrationId) { 
                                this.updateUserInfo(user, registrationInfo.registrationId, uuid,d.manufacturer,d.model,d.uuid,d.version).subscribe(m => {
                                },
                                e => {
                                // this.loader.dismiss();
                                console.log(`updateUserInfo fail, ${e}`);
                                //this.alert("更新使用者資訊失敗", "請連絡開發小組(514-32628)。");
                                });      
                            } 
                            else 
                            {
                            // this.loader.dismiss();
                                console.log(`getRegistrationInfo fail, ${m.message}`);
                            //this.alert("取得RegistrationID失敗", "請連絡開發小組(514-32628)。");
                            }
                        }, e =>
                        {
                        // this.loader.dismiss();
                            console.log(`get User Info fail, ${e}`);
                        // this.alert("取得使用者資訊失敗", "請確認是否安裝INX App Store!");
                        });
                    }
                    , e => {
                        // this.loader.dismiss();
                        console.log(`getDeviceID fail, ${JSON.stringify(e)}`);
                        //this.alert("取得DeviceID失敗", "請連絡開發小組(514-32628)。");
                    });
        }, e => {
                // this.loader.dismiss();
                console.log(`updateDeviceInfo fail, ${e}`);
                //this.alert("更新使用者資訊失敗", "請連絡開發小組(514-32628)。");
                });   

        }, e =>
        {
        // this.loader.dismiss();
        console.log(`getRegistrationInfo fail, ${e}`);
        //this.alert("取得RegistrationID失敗", "請連絡開發小組(514-32628)。");
        })
    
        //return Observable.from([{registrationId: "12345"}])
    }

    getUniqueDeviceID(): Observable<string> 
    {
      return Observable.fromPromise(this.uniqueDeviceID.get());
    };
  
    hasPermission() : Observable<boolean>
    {
        return Observable.fromPromise(this.push.hasPermission()).map(m => m.isEnabled);
    }

    updateUserInfo(user: InxAccount, registrationId: string, uuid:string,manufacturer:string,model:string,  universallyId:string,version:string,): Observable<any>
    {
      //  this.loader.setContent("更新使用者資訊...");
        if (window.cordova)
        {          
          console.log("update user registrationId [" + `${registrationId}` + "].");
          console.log("update user uuid [" + `${uuid}` + "].");
          return this.employeeProvider.updateEmployeeInfo(user.empNo, registrationId,uuid,manufacturer,model,universallyId,version)
        }
        return Observable.from([true]);
    }
  
    getUserInfo(): Observable<any>
    {
//      this.loader.setContent("取得使用者資訊...");
      return this.accountProvider.getUserInfo().map(m => {
        console.log("get user [" + `${m.comid}` + "] logged in.");      
        return m;
      });
    }
    getDeviceInfo(): Observable<any>
    {
        var d=new DeviceInfo;
        var deviceInfoPromise = new Promise((resolve, reject) => {
            if(this.device.platform)
                {
                    d.cordova=this.device.cordova
                    d.isVirtual=this.device.isVirtual
                    d.manufacturer=this.device.manufacturer
                    d.model=this.device.model
                    d.serial=this.device.serial
                    d.uuid=this.device.uuid
                    d.version=this.device.version
                    console.log("Device Info [" + JSON.stringify(d) + "]");      
                    resolve(d); // 實現

                }
                else{

                    console.log("Device Info Fail [" + JSON.stringify(d) + "]");   
                    reject(d); // 拒絕   
                }
          });
           
          return Observable.fromPromise(deviceInfoPromise);
          
           


     
    }
  
  }
