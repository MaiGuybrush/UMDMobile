import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SubscribeConfigPage } from '../subscribe-config/subscribe-config';
import { SubscriptionProvider } from '../../providers/subscription-provider'
import { Subscribe } from '../../models/subscribe';
import { AccountProvider } from '../../providers/account-provider'
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the SubscribeAdd page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-subscribe-add',
  templateUrl: 'subscribe-add.html'
})
export class SubscribeAddPage {
alarmtype: string;
nosubscriptions: Subscribe[] = [];
pattern : string;
alarmIds: string[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: SubscriptionProvider,
              public alertCtrl:AlertController, public loading: LoadingController,  public accountProvider: AccountProvider) {
  }

  ionViewDidLoad() {
    this.pattern="";
    this.alarmtype = this.navParams.get('alarmtype');
    let loader = this.loading.create({
           content: 'Loading...',
        });

    loader.present();
    this.provider.getNotSubscribed(this.accountProvider.getInxAccount().empNo,this.alarmtype,this.pattern).subscribe(
         res => {
                   this.nosubscriptions = res
                   if(res) loader.dismiss();
                  }
       );  
    console.log('ionViewDidLoad SubscribeAddPage');
  }

  checkAlarm():boolean
  {
     this.alarmIds =[];
     for (let i=0; i<this.nosubscriptions.length; i++) {
         if (this.nosubscriptions[i].isChecked== true)
          {
            this.alarmIds.push(this.nosubscriptions[i].alarmId);
          }  
     }

     if (this.alarmIds === null|| this.alarmIds.length ===0) { 
        this.showAlert('請選擇至少一筆AlarmID');                        
        return false;
     }
     return true;
  }

  showAlert(subTitle:string): void
  {
        let alert = this.alertCtrl.create({ title: '訊息', subTitle: subTitle,buttons: ['OK'] });
        alert.present();
  }

  gotoConfig(): void
  {
     if (this.checkAlarm() === false) return;
     //新增Mobile訂閱
     let loader = this.loading.create({
           content: 'Processing...',
        });

     loader.present();
          this.provider.subscribeAlarm(this.alarmIds, 99, this.accountProvider.getInxAccount().empNo,'',this.accountProvider.getInxAccount().empNo)
              .subscribe(                
                m => {
                      if (m === true) {
                        loader.dismiss();
                        this.navCtrl.push(SubscribeConfigPage, {'alarmtype': this.alarmtype, 'alarmIds': this.alarmIds });
                        }
                     });
  }

  onInput($event)
  {
     this.provider.getNotSubscribed(this.accountProvider.getInxAccount().empNo,this.alarmtype,this.pattern).subscribe(
         res => this.nosubscriptions = res
       ); 
  }


}
