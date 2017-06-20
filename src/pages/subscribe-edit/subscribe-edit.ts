import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SubscribeAddPage } from '../subscribe-add/subscribe-add';
import { SubscriptionProvider } from '../../providers/subscription-provider'
import { Subscribe } from '../../models/subscribe';
import { SubscribeCancelResult } from '../../models/subscribe-cancel-result';
import { SubscribeConfigPage } from '../subscribe-config/subscribe-config';
import { AccountProvider } from '../../providers/account-provider';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the SubscribeEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-subscribe-edit',
  templateUrl: 'subscribe-edit.html'
})
export class SubscribeEditPage {
alarmtype: string;
subscriptions: Subscribe[] = [];
alarmIds: string[]=[];
isSuccess : boolean;
subscribeCancelResult : SubscribeCancelResult;
  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: SubscriptionProvider,
              public alertCtrl:AlertController, public loading: LoadingController, public accountProvider: AccountProvider) {
  }
   
  ionViewDidLoad() {
    let loader = this.loading.create({
           content: 'Loading...',
        });

    loader.present();
    this.alarmtype = this.navParams.get('alarmtype');
    this.provider.getSubscribed(this.accountProvider.getInxAccount().empNo,this.alarmtype,'').subscribe(
         res => {
           this.subscriptions = res
           if(res) loader.dismiss();
         }
    );   

    console.log('ionViewDidLoad SubscribeEditPage');
  }
  
  gotoAdd(): void
  {
      this.navCtrl.push(SubscribeAddPage,  {alarmtype: this.alarmtype});
  }

  gotoEdit(subscription: Subscribe): void
  {
      this.navCtrl.push(SubscribeConfigPage, {'subscription': subscription,'alarmtype': this.alarmtype});
  }

  cancelAlarm(): void
  {
     let loader = this.loading.create({
        content: '正在取消訂閱...',
      });

     loader.present();

     this.alarmIds =[];
     let msg:string ="";

     this.subscriptions.forEach(subscription =>{
         if (subscription.isChecked === true)  this.alarmIds.push(subscription.alarmId);
     })

     this.provider.cancelSubscribeAlarm(this.alarmIds,this.accountProvider.getInxAccount().empNo).subscribe(
                  res =>{
                         if (res.isSuccess === false)
                         {
                            for (let i= res.subResult.length-1 ; i>=0; i--) {
                                if (res.subResult[i].isSuccess === true)
                                {
                                   for (let j= this.subscriptions.length-1 ; j>=0; j--) {
                                       if (res.subResult[i].alarmId === this.subscriptions[j].alarmId) 
                                       this.subscriptions.splice(j,1);
                                   }
                                }
                                else if (res.subResult[i].isSuccess === false )
                                {
                                   msg += msg ===""? res.subResult[i].message : "," + res.subResult[i].message;
                                }
                             }
                          }
                        loader.dismiss();
                        if (msg)
                        {
                         let alert = this.alertCtrl.create({
                                     title: '訊息',
                                     subTitle: msg,
                                     buttons: ['OK']
                                     });
                         alert.present();
                        }
                      },
                  error => {
                    loader.dismiss();
                    console.log('Error: ', error);
                  }
     );  
  }

}
