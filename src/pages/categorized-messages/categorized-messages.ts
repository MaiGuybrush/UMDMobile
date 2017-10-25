import { Component, Input, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment'
import { MessageProvider } from '../../providers/message-provider';
import { ConfigProvider } from '../../providers/config-provider';
import { PushProvider } from '../../providers/push-provider';
import { MessageCategoryComponentModule } from '../../components/message-category/message-category.module';
import { MessageCategoryComponent, CategoryMethod } from '../../components/message-category/message-category.component';
import { MessagesPage } from '../messages/messages';
import { ReleaseNotePage } from '../release-note/release-note';
import { Subscription } from 'rxjs/Subscription';
import { CategorizedSummary } from '../../models/categorized-summary'
import { AppVersion } from '@ionic-native/app-version';

/*
  Generated class for the CategorizedMessage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-categorized-message',
  templateUrl: 'categorized-messages.html'
})
export class CategorizedMessagesPage {
  CategoryMethod = CategoryMethod
  category : CategoryMethod = CategoryMethod.AlarmType;
  // messages : Message[] = [];
  @Input() categorizedSummary: CategorizedSummary[]
  subscription : Subscription;
  // categorizedMessage : CategorizedMessages[]
  constructor(public navCtrl: NavController, public navParams: NavParams, public zone: NgZone
    , public provider: MessageProvider, public pushProvider: PushProvider
    , public config: ConfigProvider, private appVersion: AppVersion) 
  {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategorizedMessagePage');

    this.appVersion.getVersionNumber().then(m => {
      this.config.getConfig().appVersion = m;
      if (!this.config.getConfig().lastViewAppVersion || this.config.getConfig().lastViewAppVersion != m)
      {
        this.navCtrl.push('ReleaseNotePage');
      }
    })
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter CategorizedMessagePage');
    this.loadByCategory();
    // this.provider.getAllMessage().subscribe(
    //   m => {
    //     this.messages = [].concat(m);
    //   });
    this.subscription = this.provider.getMessageNotifier().subscribe(m => {
      if (m.readCount > 0) //>0 表示不是新訊息
      {
        return;
      }
      this.zone.run(() => {
        let found = false;
        for (let i = 0; i < this.categorizedSummary.length; i++) {
          let msg = this.categorizedSummary[i];
          if (msg.groupItem == m[this.getCategoryField()])
          {
            msg.unreadCount ++;
            found = true;
            this.categorizedSummary.splice(i, 1);
            this.categorizedSummary.unshift(msg)
            this.categorizedSummary = [].concat(this.categorizedSummary)
            break;
          } 
        }
        if (!found)
        {
          this.categorizedSummary.unshift({
            groupItem: m[this.getCategoryField()], 
            unreadCount: 1,
            lastestMessageDT: moment(m.occurDT).format('YYYY-MM-DD HH:mm:ss.SSSSSS')
          });
          this.categorizedSummary = [].concat(this.categorizedSummary)
        }
      });

    });

  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  insertTestMessages()
  {
    this.provider.insertTestMessages();
  }

  getCategoryField() {
    switch(this.category)
    {
      case CategoryMethod.AlarmID:
          return 'alarmID';
      case CategoryMethod.Equipment:
          return 'eqptID';
      case CategoryMethod.AlarmType:
          return 'alarmType';
    }
  }
  
  pushPage(event): void
  {
//        this.navCtrl.push(MessagesPage, {'messages': this.messages})
      this.navCtrl.push(MessagesPage, {'categoryMethod': event.categoryMethod, 'categoryValue': event.categoryValue})
  }

  loadByCategory()
  {
    this.provider.getUnreadMessageCount(this.getCategoryField()).subscribe(
      m => {
        this.categorizedSummary = m;
        let sum = 0;
        for (let i = 0; i < m.length; i++)
        {
          sum += m[i].unreadCount;
        }
        this.pushProvider.setBadgeCount(sum).subscribe();
      }, 
      e => {
        console.log("loadByCategory failed!" + JSON.stringify(e))
      }
      , 
      () => {
      }
    );

  }

  changeCategory(categoryMethod: CategoryMethod)
  {
    this.category = categoryMethod;
    this.loadByCategory();
  }
}
