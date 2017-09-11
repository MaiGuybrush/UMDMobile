import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SubscribeEditPage } from '../subscribe-edit/subscribe-edit';
import { GroupSearchPage } from '../group-search/group-search';
import { PeopleSearchPage } from '../people-search/people-search';
import { DepartmentSelectPage } from '../department-select/department-select';
import { SubscribeMappgroupPage } from '../subscribe-mappgroup/subscribe-mappgroup';
import { Events} from 'ionic-angular';
import { Platform, ActionSheetController } from 'ionic-angular'
import { Subscribe } from '../../models/subscribe';
import { AlarmAction } from '../../models/alarm-action';
import { AlarmActionSetting } from '../../models/alarm-action-setting';
import { AlarmProvider } from '../../providers/alarm-provider';
import { AccountProvider } from '../../providers/account-provider'
import { SubscriptionProvider } from '../../providers/subscription-provider'
import { LoadingController } from 'ionic-angular';


/*
  Generated class for the SubscribeConfig page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-subscribe-config',
  templateUrl: 'subscribe-config.html'
})
export class SubscribeConfigPage {
  subscription: Subscribe;
  alarmtype: string;
  alarmActionSettings: AlarmActionSetting[] = [];
  alarmActions: AlarmAction[] = [];
  isSuccess : boolean;
  accountId: string;
  actionType: number;
  alarmIds: string[]=[];
  searching: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public platform: Platform,
              public provider: AlarmProvider, public subscriptionProvider: SubscriptionProvider, public loading: LoadingController, 
              public accountProvider: AccountProvider, public actionsheetCtrl: ActionSheetController) {
  }

  ionViewDidLoad() {

          this.subscription = this.navParams.get('subscription');
          this.alarmtype = this.navParams.get('alarmtype');
          this.alarmIds = this.navParams.get('alarmIds');
          this.accountId = this.accountProvider.getInxAccount().empNo;
          if (this.subscription)
          {
            //  let loader = this.loading.create({content: 'Loading...'});
            //  loader.present();
             this.searching = true;
             this.provider.getAlarmActionSetting(this.subscription.alarmId).subscribe(
                 res => {
                   this.searching = false;
                   this.alarmActionSettings = res
                  //  if(res) loader.dismiss();
                  }
             ); 
          }
    console.log('ionViewDidLoad SubscribeConfigPage');
  }

  done(): void
  {
        if (this.alarmActions.length === 0)
        {
          this.navCtrl.setRoot(SubscribeEditPage, {'alarmtype': this.alarmtype});
          return;
        }

        if (this.subscription !=null)
        {
          this.editSubscriptionConfig();
        }else if (this.alarmIds.length != 0)
        {
          this.addSubscriptionConfig();
        }
  }

  editSubscriptionConfig():void
  {
          let loader = this.loading.create({content: 'Processing...'});
          loader.present();
          this.provider.addAlarmAction(
            this.subscription.alarmId,this.accountProvider.getInxAccount().empNo,this.alarmActions)
              .subscribe(
                m => 
                  {
                   if (m === true) 
                   {
                     loader.dismiss();
                     this.navCtrl.setRoot(SubscribeEditPage, {'alarmtype': this.alarmtype});
                   }
                  }
                );
  }

  addSubscriptionConfig():void
  {
          let loader = this.loading.create({content: 'Processing...'});
          loader.present();
          this.alarmActions.forEach(alarmAction => {
            if (alarmAction.actionType === 1 && alarmAction.isDept === false) //For SubscribeAlarm 發送對象工號, 或 &[部門代碼]
            {
             this.subscriptionProvider.subscribeAlarm(this.alarmIds,alarmAction.actionType,alarmAction.mailEmpId,
                                                      alarmAction.chatName,this.accountProvider.getInxAccount().empNo)
              .subscribe(                
                m => 
                  {
                   if (m === true) 
                   {
                     loader.dismiss();
                     this.navCtrl.setRoot(SubscribeEditPage, {'alarmtype': this.alarmtype});
                   }
                  }
                );
            }else
            {
             this.subscriptionProvider.subscribeAlarm(this.alarmIds,alarmAction.actionType,alarmAction.actionValue,
                                                      alarmAction.chatName,this.accountProvider.getInxAccount().empNo)
              .subscribe(
                m => 
                  {
                   if (m === true) 
                   {
                     loader.dismiss();
                     this.navCtrl.setRoot(SubscribeEditPage, {'alarmtype': this.alarmtype});
                   }
                  }
                );
            }
          });
  }

  callbackFunction = (params) => 
  {
     return new Promise((resolve, reject) => {
            if (params)
            {
               this.alarmActions.push(params);
            }
            resolve();
         });
  }

  doDeleteS(alarmActionSetting: AlarmActionSetting): void
  {
                if (alarmActionSetting.settingType === "M"){
                 for (let i=0; i<this.alarmActionSettings.length;i++) {
                    if (this.alarmActionSettings[i].mailRecipient === alarmActionSetting.mailRecipient) {
                      this.provider.deleteAlarmAction(
                        this.subscription.alarmId,this.alarmActionSettings[i].settingType,this.alarmActionSettings[i].mailRecipient,
                        this.alarmActionSettings[i].mAppChatSn,this.accountProvider.getInxAccount().empNo).subscribe(m => this.isSuccess = m);
                      this.alarmActionSettings.splice(i,1); 
                    }
                 }
                }else if (alarmActionSetting.settingType === "AP" || 
                          alarmActionSetting.settingType === "AG" || 
                          alarmActionSetting.settingType === "AC"){
                 for (let i=0; i<this.alarmActionSettings.length;i++) {
                  if (this.alarmActionSettings[i].mAppChatSn === alarmActionSetting.mAppChatSn) {
                      this.provider.deleteAlarmAction(
                        this.subscription.alarmId,this.alarmActionSettings[i].settingType,this.alarmActionSettings[i].mailRecipient,
                        this.alarmActionSettings[i].mAppChatSn,this.accountProvider.getInxAccount().empNo).subscribe(m => this.isSuccess = m);
                      this.alarmActionSettings.splice(i,1); 
                   }
                 }
                }
  }

  doDelete(alarmAction: AlarmAction): void
  {
                 for (let i=0; i<this.alarmActions.length;i++) {
                  if (this.alarmActions[i].actionType === alarmAction.actionType && 
                      this.alarmActions[i].actionValue === alarmAction.actionValue) {
                      this.alarmActions.splice(i,1); 
                  }
                 }
  }



  openMenu(menuType: number) {
    let menuButtons = undefined;
    switch(menuType)
    {
      case 1:
        menuButtons = [
          {
            text: 'Mail-選擇群組',
            icon: !this.platform.is('ios') ? 'contacts' : null,
            handler: () => {
              this.actionType = 2;
              this.navCtrl.push(GroupSearchPage, {'callback': this.callbackFunction, 'actionType': this.actionType, 'pageTitle': "選擇群組", 'filterAlarmActions': this.alarmActions})
            }
          },
          {
            text: 'Mail-選擇人員',
            icon: !this.platform.is('ios') ? 'person' : null,
            handler: () => {
              this.actionType = 1;           
              this.navCtrl.push(PeopleSearchPage, {'callback': this.callbackFunction, 'actionType': this.actionType, 'pageTitle': "選擇人員", 'filterAlarmActions': this.alarmActions})
            }
          },
          {
            text: 'Mail-選擇部門',
            icon: !this.platform.is('ios') ? 'people' : null,
            handler: () => {
              this.actionType = 1; 
              this.navCtrl.push(DepartmentSelectPage, {'callback': this.callbackFunction, 'actionType': this.actionType, 'pageTitle': "選擇部門", 'filterAlarmActions': this.alarmActions})
            }
          },
          {
            text: 'Cancel',
            role: 'cancel', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ];
        break;
      case 2:
        menuButtons = [
          {
            text: 'MAPP-選擇群組',
            icon: !this.platform.is('ios') ? 'contacts' : null,
            handler: () => {
            this.actionType = 4;
              this.navCtrl.push(GroupSearchPage, {'callback': this.callbackFunction,'actionType': this.actionType, 'pageTitle': "選擇群組", 'filterAlarmActions': this.alarmActions})
            }
          },
          {
            text: 'MAPP-選擇人員',
            icon: !this.platform.is('ios') ? 'person' : null,
            handler: () => {
              this.actionType = 3; 
              this.navCtrl.push(PeopleSearchPage, {'callback': this.callbackFunction,'actionType': this.actionType, 'pageTitle': "選擇人員", 'filterAlarmActions': this.alarmActions})
            }
          },
          {
            text: 'MAPP-輸入聊天室ID',
            icon: !this.platform.is('ios') ? 'chatbubbles' : null,
            handler: () => {
              this.actionType = 5; 
              this.navCtrl.push(SubscribeMappgroupPage, {'callback': this.callbackFunction, 'actionType': this.actionType } )
            }
          },
          {
            text: 'Cancel',
            role: 'cancel', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ];
        break;
    }
    let actionSheet = this.actionsheetCtrl.create({
      title: '通知對象',
      cssClass: 'action-sheets-basic-page',
      buttons: menuButtons
    });
    actionSheet.present();
  }
}
