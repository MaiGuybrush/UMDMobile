import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, AlertController } from "ionic-angular"
import { LoadingController, Loading } from 'ionic-angular';
import { AccountProvider } from '../../providers/account-provider'
import { PushProvider } from '../../providers/push-provider'
import { InxAccount } from '../../models/inx-account'
import { EmployeeProvider } from '../../providers/employee-provider'
import { MessageProvider } from '../../providers/message-provider';
import { Message } from '../../models/message'
import { TabsPage } from '../tabs/tabs'
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
// import { ConfigProvider } from '../../providers/config-provider';
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
  loader: Loading;
  url: string;
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams
              , public loading: LoadingController, public alertCtrl: AlertController, public accountProvider: AccountProvider
              , public employeeProvider: EmployeeProvider, public messageProvider: MessageProvider
              , public pushProvider: PushProvider, public uniqueDeviceID:UniqueDeviceID) {
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
      this.loader = this.loading.create();
      this.loader.present();
      
      this.getUserInfo().subscribe(m => {
        var user = m;
         this.getUniqueDeviceID().then(
          uuid=>{
        this.pushProvider.pushInit().subscribe(m => {
          if (m.registrationId) {
            console.log(`get registrationId = ${m.registrationId}`);
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
                this.alert("DB初始化失敗", "請連絡開發小組(514-32628)。");
              })
            },
            e => {
              this.loader.dismiss();
              console.log(`updateUserInfo fail, ${e}`);
              this.alert("更新使用者資訊失敗", "請連絡開發小組(514-32628)。");
            });      
          } 
          else 
          {
            this.loader.dismiss();
            console.log(`getRegistrationInfo fail, ${m.message}`);
            this.alert("取得RegistrationID失敗", "請連絡開發小組(514-32628)。");
          }
        }, e =>
        {
          this.loader.dismiss();
            console.log(`getRegistrationInfo fail, ${e}`);
            this.alert("取得RegistrationID失敗", "請連絡開發小組(514-32628)。");
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
  

  

  
  setUrl(event)
  {
    this.url = event.target.value;
  }

  openUrl(event)
  {
    window.open(this.url);
  }
}
