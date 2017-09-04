import { Component, Input, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment'
import { MenuController } from 'ionic-angular';
import { MessageProvider } from '../../providers/message-provider';
import { MessageCategoryComponentModule } from '../../components/message-category/message-category.module';
import { MessageCategoryComponent, CategoryMethod } from '../../components/message-category/message-category.component';
import { MessagesPage } from '../messages/messages';
import { AuthTestPage } from '../auth-test/auth-test';
import { Subscription } from 'rxjs/Subscription';
import { CategorizedSummary } from '../../models/categorized-summary'

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
  activeMenu : string = "menu1";
  category : CategoryMethod = CategoryMethod.ByAlarmType;
  // messages : Message[] = [];
  @Input() categorizedSummary: CategorizedSummary[]
  subscription : Subscription;
  // categorizedMessage : CategorizedMessages[]
  constructor(public navCtrl: NavController, public navParams: NavParams, public zone: NgZone
    , public menu: MenuController, public provider: MessageProvider) 
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategorizedMessagePage');
    this.menu.enable(true, 'menu1');
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
      case CategoryMethod.ByAlarmID:
          return 'alarmID';
      case CategoryMethod.ByEquipment:
          return 'eqptID';
      case CategoryMethod.ByAlarmType:
          return 'alarmType';
    }
  }
  
  authTest()
  {
    this.navCtrl.push(AuthTestPage)    
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
