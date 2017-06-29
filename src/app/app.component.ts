import { Component, ViewChild } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'
import { Platform, Nav, AlertController } from "ionic-angular"
import { LoadingController } from 'ionic-angular';
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
import { AccountProvider } from '../providers/account-provider'
import { EmployeeProvider } from '../providers/employee-provider'
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
    topic: string;
    public static pushObject: PushObject;
    public static fcmRegistrationId: string;
    constructor(public http: Http, public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public alertCtrl: AlertController
        , public loading: LoadingController, public accountProvider: AccountProvider
        , public employeeProvider: EmployeeProvider, public messageProvider: MessageProvider, private push: Push, public accountprovider: AccountProvider) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.


      let loader = this.loading.create({
        content: '正在取得使用者資訊...',
      });

      loader.present();
      var me = this;
      this.accountProvider.getUserInfo().subscribe(m => {
        console.log("get user [" + `${m.comid}` + "] logged in.");
        me.pushInit();
        MyApp.pushObject.on('registration').subscribe((data: any) => {
          MyApp.fcmRegistrationId = data.registrationId;
          this.employeeProvider.updateEmployeeInfo(m.comid, MyApp.fcmRegistrationId)
          .subscribe(m => 
          { 
            console.log("update user info successfully");
          },
          e => {
            console.log("update user info fail");
          },
          () => {
            loader.dismiss();      
          });
        });
      }, e => {
        loader.dismiss()
        let alert = this.alertCtrl.create({
          title: '無法取得使用者資訊',
          subTitle: '請確認是否安裝INX App Store!',
          buttons: [{
            text: '結束',
            role: 'cancel',
            handler: () => {
              if (me.platform.is("ios"))
              {
              }
              else
              {
                me.platform.exitApp();
              }
            }
          }]
        });
        alert.present();
      });



      });
    }

  pushInit()
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
            sound: 'false',
            senderID: '834424631529',
            gcmSandbox: "true"
      },
      windows: {}
    };
    MyApp.pushObject = this.push.init(options);
    MyApp.pushObject.on('notification').subscribe((data: any) => {
      me.pushNotificationHandler(data);
    });
    MyApp.pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    
  }

  pushNotificationHandler(data: any) {
    let m: Message = new Message;
    m.id = data.additionalData["google.message_id"];
    m.occurDT = data.additionalData.occurDT;
    m.alarmID = data.title;
    m.eqptID = data.additionalData.eqptID;
    m.alarmMessage = data.message;
    m.alarmType = data.additionalData.alarmType;
    m.description = data.additionalData.description;

    //if user using app and push notification comes
    if (data.additionalData.foreground) {
      // if application open
      this.messageProvider.saveMessage(m);
      console.log("Push notification app open" + data.alarmID);
    } else {
      if (!data.additionalData.coldstart) {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        this.messageProvider.saveMessage(m);
        console.log("Push notification background " + data.alarmID);
      }
    }
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