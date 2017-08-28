import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment'
import { MenuController } from 'ionic-angular';
import { MessageProvider } from '../../providers/message-provider';
import { MessageCategoryComponentModule } from '../../components/message-category/message-category.module';
import { MessageCategoryComponent, CategoryMethod } from '../../components/message-category/message-category.component';
import { MessagesPage } from '../messages/messages';
import { AuthTestPage } from '../auth-test/auth-test';
import { Subscription } from 'rxjs/Subscription';
import { LoadingController, Loading } from 'ionic-angular';
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
  loader: Loading;
  category : CategoryMethod = CategoryMethod.ByAlarmType;
  // messages : Message[] = [];
  categorizedSummary: CategorizedSummary[]
  subscription : Subscription;
  // categorizedMessage : CategorizedMessages[]
  constructor(private ref: ChangeDetectorRef, public navCtrl: NavController, public navParams: NavParams
    , public loading: LoadingController, public menu: MenuController, public provider: MessageProvider) 
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
        var me = this;
    this.subscription = this.provider.getMessageNotifier().subscribe(m => {
      if (m.readCount > 0) //>0 表示不是新訊息
      {
        return;
      }
      // me.loader = me.loading.create();
      // me.loader.present();

      let found = false;
      for (let i = 0; i < me.categorizedSummary.length; i++) {
        let msg = me.categorizedSummary[i];
        if (msg.groupItem == m[me.getCategoryField()])
        {
          msg.unreadCount ++;
          found = true;
          me.categorizedSummary.splice(i, 1);
          me.categorizedSummary.unshift(msg)
          me.categorizedSummary = [].concat(me.categorizedSummary)
          break;
        } 
      }
      if (!found)
      {
        me.categorizedSummary.unshift({
          groupItem: m[me.getCategoryField()], 
          unreadCount: 1,
          lastestMessageDT: moment(m.occurDT).format('YYYY-MM-DD HH:mm:ss.SSSSSS')
        });
        me.categorizedSummary = [].concat(me.categorizedSummary)
      }

      //me.categorizedSummary = [].concat(me.categorizedSummary);
      // me.loader.dismiss();
      // me.messages.push(m);
      // me.messages = [].concat(me.messages);
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
    this.loader = this.loading.create();
    this.loader.present();
    var me = this;
    this.provider.getUnreadMessageCount(this.getCategoryField()).subscribe(
      m => {
        me.categorizedSummary = m;
      }, 
      e => {
        console.log("loadByCategory failed!" + JSON.stringify(e))
        me.loader.dismiss();
      }
      , 
      () => {
        me.loader.dismiss();
      }
    );

  }

  changeCategory(categoryMethod: CategoryMethod)
  {
    this.category = categoryMethod;
    this.loadByCategory();
  }
}
