import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SubscribeAddPage } from '../subscribe-add/subscribe-add';
import { SubscriptionProvider } from '../../providers/subscription-provider'
import { Subscribe } from '../../models/subscribe';
import { SubscribeCancelResult } from '../../models/subscribe-cancel-result';
import { SubscribeConfigPage } from '../subscribe-config/subscribe-config';
import { AccountProvider } from '../../providers/account-provider';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx'
import { Content } from 'ionic-angular';


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
@ViewChild(Content) content: Content;
alarmtype: string;
subscriptions: Subscribe[] = [];
alarmIds: string[]=[];
isSuccess : boolean;
subscribeCancelResult : SubscribeCancelResult;
queryPage: number;
searching: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: SubscriptionProvider,
              public alertCtrl:AlertController, public loading: LoadingController, public accountProvider: AccountProvider) {
  }
   
  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscribeEditPage');
    // let loader = this.loading.create({content: 'Loading...'});
    // loader.present();
    this.alarmtype = this.navParams.get('alarmtype');
    // if (search.length > 0)
    // {
      this.queryPage =1;
      this.searching = true;
      this.getSubscribed().subscribe( m => {
           this.searching = false;
           this.subscriptions = m;
         });
    // this.provider.getSubscribed(this.accountProvider.getInxAccount().empNo,this.alarmtype,'',).subscribe(
    //      res => {
    //        this.subscriptions = res
    //        loader.dismiss();
    //      }
    // );   

  }

  getSubscribed() : Observable<Subscribe[]>
  {
    let subs = this.provider.getSubscribed(this.accountProvider.getInxAccount().empNo,this.alarmtype,'',this.queryPage)
    if (subs!= null) this.queryPage +=1;
    return subs;
  }

  
  gotoAdd(): void
  {
      this.navCtrl.push(SubscribeAddPage,  {'alarmtype': this.alarmtype});
  }

  gotoEdit(subscription: Subscribe): void
  {
      this.navCtrl.push(SubscribeConfigPage, {'subscription': subscription,'alarmtype': this.alarmtype});
  }

  checkAlarm():boolean
  {
     this.alarmIds =[];
     this.subscriptions.forEach(subscription =>{
         if (subscription.isChecked === true)  this.alarmIds.push(subscription.alarmId);
     })

     if (this.alarmIds === null|| this.alarmIds.length ===0) { 
        this.showAlert('請選擇至少一筆AlarmID');                        
        return false;
     }
     return true;
  }

  cancelConfirm():void
  {

  if (this.checkAlarm() === false) return;
  let alert = this.alertCtrl.create({
    title: '取消訂閱',
    buttons: [
      {
        text: 'Cancel',
        handler: () => {console.log('Not to Cancel Subscription');}
        
      },
      {
        text: 'OK',
        handler: () => {this.cancelAlarm();}
      }
    ]
  });
  alert.present();
  }

  cancelAlarm():void
  {
     let loader = this.loading.create({
        content: 'Processing...',
      });

     loader.present();

     let msg:string ="";
     this.provider.cancelSubscribeAlarm(this.alarmIds,this.accountProvider.getInxAccount().empNo).subscribe(
                  res =>{
                          for (let i= res.subResult.length-1 ; i>=0; i--) {
                               if (res.subResult[i].isSuccess === true)
                                {
                                   for (let j= this.subscriptions.length-1 ; j>=0; j--) {
                                       if (res.subResult[i].alarmId === this.subscriptions[j].alarmId) 
                                       this.subscriptions.splice(j,1);
                                   }
                                }else if (res.subResult[i].isSuccess === false )
                                {
                                   msg += msg ===""? res.subResult[i].message : "," + res.subResult[i].message;
                                }
                          }
                        loader.dismiss();
                        if (msg) this.showAlert(msg);
                      },
                  error => {
                    loader.dismiss();
                    console.log('Error: ', error);
                  }
     );  
  }

  showAlert(subTitle:string): void
  {
        let alert = this.alertCtrl.create({ title: '訊息', subTitle: subTitle,buttons: ['OK'] });
        alert.present();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

      setTimeout(() => {
       this.getSubscribed().subscribe( m => {
        this.subscriptions = this.subscriptions.concat(m);
        console.log('Async operation has ended:' + this.subscriptions.length);
         infiniteScroll.complete();
       });
      }, 500);
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

}
