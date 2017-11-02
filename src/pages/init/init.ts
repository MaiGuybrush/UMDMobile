import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen'
import { Platform, AlertController } from "ionic-angular"
import { LoadingController, Loading } from 'ionic-angular';
import { PushProvider } from '../../providers/push-provider'
import { InxAccount } from '../../models/inx-account'
import { EmployeeProvider } from '../../providers/employee-provider'
import { MessageProvider } from '../../providers/message-provider';
import { Message } from '../../models/message'
import { TabsPage } from '../tabs/tabs'
import { CategorizedMessagesPage } from '../categorized-messages/categorized-messages'
import { AuthTestPage } from '../auth-test/auth-test'
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AccountProvider } from '../../providers/account-provider'
import { ConfigProvider } from '../../providers/config-provider';

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
  test: number;
  res: string;
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams
              , public loading: LoadingController, public alertCtrl: AlertController, public accountProvider: AccountProvider
              , public employeeProvider: EmployeeProvider, public messageProvider: MessageProvider
              , public pushProvider: PushProvider, public uniqueDeviceID:UniqueDeviceID, public configProvider: ConfigProvider
              , public splashScreen: SplashScreen) {
    this.test = 0;
    console.log("InitPage constructor in.")
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
    // Observable.timer(2000, 1000).timeInterval().take(10).subscribe(m => {
    //   this.test = this.test + 1
    // })
    this.initialize();
    
  }

  ionViewDidLeave() {
    this.splashScreen.hide();
  }    

  onClick()
  {
    this.test = this.test + 1;
    this.accountProvider.getUserInfo().subscribe(m => {
      this.res = JSON.stringify(m)
    })
    //this.initialize();
  }
  initialize()
  {
    if (!window.cordova){
      this.navCtrl.setRoot(TabsPage);
      return;
    }
    let debug = false;
    if (debug)
    {
      this.navCtrl.setRoot(TabsPage);

      return;
    }
    this.platform.ready().then(() => { 
    //  this.loader = this.loading.create();
    //  this.loader.present();
        //  this.pushProvider.hasPermission().subscribe( m => {
      
      this.configProvider.loadConfig().subscribe( m => {
        this.pushProvider.pushInit();
     
        this.initDB().subscribe(m => { 
          console.log("execute initDB subscribe..")
          this.messageProvider.deleteOverDurationsMessages(60).subscribe(
            m => {},
            e => {},
            () => {
              this.messageProvider.loadKeptPush().subscribe(m =>{}, e => {}, () => {
                this.navCtrl.setRoot(TabsPage);
              })
            }
          )
        },
        e => {
          // this.loader.dismiss();
          console.log(`initDB fail, ${JSON.stringify(e)}`);
          this.alert("DB初始化失敗", "請連絡開發小組(514-32628)。");
        })
      })   
    });

  }

  initDB(): Observable<any>
  {
 //   this.loader.setContent("正在初始化...");
    return this.messageProvider.init();
  }


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
