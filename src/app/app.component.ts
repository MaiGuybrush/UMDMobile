import { Component, ViewChild } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'
import { Platform, Nav, AlertController } from "ionic-angular"
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { DetailsPage } from "../pages/details/details"
import { TabsPage } from '../pages/tabs/tabs'
//import { PeopleSearchPage } from '../pages/people-search/people-search'
import { GroupSearchPage } from '../pages/group-search/group-search'
import { ConfigPage } from '../pages/config/config';
import { ExtraInfoProvider } from '../providers/extrainfo-provider'
import { MessageProvider } from '../providers/message-provider';
import { AccountProvider } from'../providers/account-provider'
import { InxAccount } from '../models/inx-account'
import { Message } from '../models/message'
import { Observable } from 'rxjs/Rx'
import { Api } from './api'

declare var window;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = TabsPage;
  public static user: InxAccount;
  topic:string;
  constructor(public http: Http,public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public alertCtrl: AlertController
            , public userProvider: ExtraInfoProvider, public messageProvider: MessageProvider,private push: Push,public accountprovider :AccountProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    
      if (window.cordova)
      {
         this.umdMessage();       
       
      }
      else
      {
      }
    });
  }
    umdMessage(){
          const options: PushOptions = {
            
          android: {
              senderID: '834424631529',
           //    topics: ['sample-topic','dally-topic']
          },
          ios: {
              alert: 'true',
              badge: true,
              sound: 'false'
          },
          windows: {}
        };
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('registration').subscribe((data: any) => {
           console.log("emp no -> " +this.accountprovider.getInxAccount().empNo+" device token -> " + data.registrationId);  
           //this.setDeviceToken(this.accountprovider.getInxAccount().empNo,data.registrationId);
        
      //TODO - send device token to server
    });
    
    pushObject.on('notification').subscribe((data: any) => {
       
         let m: Message=new Message;
           m.id=data.additionalData["google.message_id"];
           m.occurDT=data.additionalData.occurDT; 
           m.alarmID=data.title;
           m.eqptID=data.additionalData.eqptID; 
           m.alarmMessage=data.message;
           m.alarmType=data.additionalData.alarmType;
           m.description=data.additionalData.description;                  
       
         //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open
         this.messageProvider.saveMessage(m);     
          console.log("Push notification app open"+data.alarmID);
      } else {
        if (!data.additionalData.coldstart) {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
          this.messageProvider.saveMessage(m);   
          console.log("Push notification background "+data.alarmID);         
        }
      }
    });
        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }
  // setDeviceToken(empId:string, DeviceToken: string) : Observable<string>
  // {
  //    let headers = new Headers({ 'Content-Type': 'application/json' });
  //    let options = new RequestOptions({ headers: headers });

  //     let url = 'http://c4c010685.cminl.oa/UMD/Services/UMDDataService.svc/UpdateUserInfo';

  //    let body = {"EmpId": `${empId}`, "DeviceToken": `${DeviceToken}`};
  //   //  let output = [];
  //    let err = "";
  //    console.log('post start');
  //    return this.http.post(url, body, options).map(res => 
  //                     Api.toCamel(res.json()).IsSuccess
  //                   );
  // }
}