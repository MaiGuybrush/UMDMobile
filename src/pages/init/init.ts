import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, AlertController } from "ionic-angular"
import { LoadingController, Loading } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AccountProvider } from '../../providers/account-provider'
import { InxAccount } from '../../models/inx-account'
import { EmployeeProvider } from '../../providers/employee-provider'
import { MessageProvider } from '../../providers/message-provider';
import { Message } from '../../models/message'
import { TabsPage } from '../tabs/tabs'
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
declare var window;

/**
 * Generated class for the InitPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-init',
  templateUrl: 'init.html',
})
export class InitPage {
  topic: string;
  static pushObject: PushObject;
  loader: Loading;
  url: string;
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams
              , public loading: LoadingController, public alertCtrl: AlertController, public accountProvider: AccountProvider
              , public employeeProvider: EmployeeProvider, public messageProvider: MessageProvider, public push: Push,public uniqueDeviceID:UniqueDeviceID) {
  }

  ionViewDidLoad() {
    if (this.platform.is("ios")){
      setTimeout(function() {
        window.handleOpenURL = (url) => {
          console.log("received url: " + url);
        }, 0  
      });
    }
    else 
    {
      window.handleOpenURL = (url) => {
        console.log("received url: " + url);
      }           
     }
    this.initialize();
  }

  initialize()
  {
    this.platform.ready().then(() => { 
      this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }
      });
      this.loader = this.loading.create();
      this.loader.present();
      
      this.getUserInfo().subscribe(m => {
        var user = m;
         this.getUniqueDeviceID().then(
          uuid=>{
            this.getRegistrationInfo().subscribe(m => {
              this.updateUserInfo(user, m.registrationId,uuid)
              .subscribe(m => {
                this.initDB().subscribe(m => { 
                    console.log("execute initDB subscribe..")
                    this.loader.dismiss();
                    this.navCtrl.setRoot(TabsPage);
                  },
                e => {
                  this.loader.dismiss();
                  console.log(`initDB fail, ${e}`);
                  this.alert("初始化失敗", "請連絡開發小組(514-32628)。");
                })
              },
              e => {
                this.loader.dismiss();
                console.log(`updateUserInfo fail, ${e}`);
                this.alert("初始化失敗", "請連絡開發小組(514-32628)。");
              });      
        }, e =>
        {
          this.loader.dismiss();
            console.log(`getRegistrationInfo fail, ${e}`);
            this.alert("初始化失敗", "請連絡開發小組(514-32628)。");
        })
          }
        );
      
      }, e =>
      {
        this.loader.dismiss();
          console.log(`get User Info fail, ${e}`);
          this.alert("取得使用者資訊失敗", "請確認是否安裝INX App Store!");
      })        
    });
    
  }

  initDB(): Observable<any>
  {
    this.loader.setContent("正在初始化...");
    return this.messageProvider.init();
  }

  getUserInfo(): Observable<any>
  {
    this.loader.setContent("取得使用者資訊...");
    return this.accountProvider.getUserInfo().map(m => {
      console.log("get user [" + `${m.comid}` + "] logged in.");      
      return m;
    });
  }

  getRegistrationInfo(): Observable<any>
  {
    this.loader.setContent("註冊推播...");
    this.pushInit();
    return InitPage.pushObject.on('registration').map(m => {
      console.log("get registrationId [" + `${m.registrationId}` + "].");
      return m;
    });;
    // .map(data => { return {
    //   success: !data.registrationId ? true : false,
    //   registrationId: data.registrationId, 
    //   message: data.message 
    // }});
  }

  updateUserInfo(user: InxAccount, registrationId: string, uuid:string): Observable<any>
  {
      this.loader.setContent("更新使用者資訊...");
      if (window.cordova)
      {          
        console.log("update user registrationId [" + `${registrationId}` + "].");
        console.log("update user uuid [" + `${uuid}` + "].");
        return this.employeeProvider.updateEmployeeInfo(user.empNo, registrationId,uuid)
      }
      return Observable.from([true]);
  }
  getUniqueDeviceID(): any 
  {
    return this.platform.ready().then(() => 
     { 
     return  this.uniqueDeviceID.get()
        .then((uuid: any) => 
        {
          console.log("get uuid [" + `${uuid}` + "].")
          return uuid;
        })
      .catch((error: any) => console.log("get uuid error [" + `${error}` + "]."));
    })
  };

  alert(title:string, subTitle:string)
  {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{
        text: '結束',
        role: 'cancel',
        handler: () => {
          if (this.platform.is("ios"))
          {
          }
          else
          {
            this.platform.exitApp();
          }
        }
      }]
    });
    alert.present(); 
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
        sound: 'true',
      },
      windows: {}
    };
    InitPage.pushObject = this.push.init(options);
    InitPage.pushObject.on('notification').subscribe((data: any) => {
      me.pushNotificationHandler(data);
    });
    InitPage.pushObject.on('error').subscribe(error => console.error('Error with Push plugin err=' + error));    
  }

  pushNotificationHandler(data: any) {
    let m = new Message();
    m.id = data.additionalData["google.message_id"];
    m.occurDT = data.additionalData.occurDT;
    m.alarmID = data.title;
    m.eqptID = data.additionalData.eqptID;
    m.alarmMessage = data.message;
    m.alarmType = data.additionalData.alarmType;
    m.description = data.additionalData.description;

    if(this.platform.is('ios')){        
        InitPage.pushObject.finish().then(()=>{
        console.log('Processing ios of push data is finished');
      })
    }


    //if user using app and push notification comes
    if (data.additionalData.foreground) {
      // if application open
      this.messageProvider.addMessage(m);

      console.log("Push notification app open " + m.alarmID);
    } else {
      if (data.additionalData.coldstart) {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        this.messageProvider.addMessage(m);
        console.log("Push notification background ");
        
      }else{
        console.log("Tap Push notification bar background " );
        window.location.replace("#/app/src/pages/meeeages/messages"); 

      }
    }
  }
  
  setUrl(event)
  {
    this.url = event.target.value;
  }

  openUrl(event)
  {
    window.open(this.url);
  }
}
