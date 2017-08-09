import { Injectable } from '@angular/core'
import { Platform } from 'ionic-angular'
import { Http, Response, RequestOptions } from '@angular/http'
import { Push, PushObject, PushOptions, RegistrationEventResponse } from '@ionic-native/push';
import { Observable } from 'rxjs/Rx'
import { PureHttp } from '../app/pure-http'
import { PushProvider } from './push-provider'
import { Message } from '../models/message'
import { MessageProvider } from './message-provider'

@Injectable()
export class FcmPushProvider implements PushProvider {
    static pushObject: PushObject;
    fcmUrl = "https://fcm.googleapis.com/fcm/send";
    fcmAthorizationKey = "AAAAwkeVcOk:APA91bGDRCbVZ06C-5c3yw1MHsby4Q2siEeXWYQfJzTyegeJr091nsSC1Efau293Kz0zwidUEaLm8Rsj3RMT0EpsVEQRoabkirl-loIPEfD2sfabMu1ETq8AJfMYPDavhyHM7cp956vO"
    
    constructor(public platform: Platform, public pureHttp: PureHttp
        , public messageProvider: MessageProvider, public push: Push) {

    }

    pushReadNotification(message: Message, name: string) : Observable<boolean>
    {
        let options = new RequestOptions();
        options.headers.set("Content-Type", "application/json")
        options.headers.set("Authorization", "key=" + this.fcmAthorizationKey)
        return this.pureHttp.post("https://fcm.googleapis.com/fcm/send", 
        { 
            "notification": {
                "title": "MessageRead",
                "additionalData": { 
                    "id": message.id,
                    "name": name
                }
            },
            "to" : "/topics/" + message.uuid
        },
        {
            
        }).map(m => m.status === 200);
    }
    
    pushNotificationHandler(data: any) {
        if (data.title == "MessageRead")
        {
            this.messageProvider
            .updateReadCount(data.additionalData.id, data.additionalData.name).subscribe();
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
            m.description = data.additionalData.description;
            m.uuid = data.additionalData.uuid;

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
                    console.log("Tap Push notification bar background " );
                    window.location.replace("#/app/src/pages/meeeages/messages"); 
                }
            }
        }
    }

    pushInit(): Observable<RegistrationEventResponse & Error>
    {
        var me = this;
        const options: PushOptions = {

            android: {
            senderID: '834424631529',
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
            me.pushNotificationHandler(data);
        });
        FcmPushProvider.pushObject.on('error').subscribe(error => console.error('Error with Push plugin err=' + error));

        return Observable.fromPromise(this.push.hasPermission()).concatMap(
        m => FcmPushProvider.pushObject.on('registration'));
    }

}
