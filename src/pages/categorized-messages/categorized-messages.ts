import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { MessageProvider } from '../../providers/message-provider';
import { CategoryMethod } from '../../component/message-category/message-category.component';
import { MessagesPage } from '../messages/messages';
import { AuthTestPage } from '../auth-test/auth-test';
import { Subscription } from 'rxjs/Subscription';
import { LoadingController, Loading } from 'ionic-angular';
/*
  Generated class for the CategorizedMessage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Component({
  selector: 'page-categorized-message',
  templateUrl: 'categorized-messages.html'
})
export class CategorizedMessagesPage {
  categoryMethod = CategoryMethod
  activeMenu : string = "menu1";
  loader: Loading;
  category : CategoryMethod = CategoryMethod.ByAlarmType;
  // messages : Message[] = [];
  unreadMessageCount: { groupItem:string, count: number }[]
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
      me.loader = me.loading.create();
      me.loader.present();

      let found = false;
      for (let i = 0; i < me.unreadMessageCount.length; i++) {
        let msg = me.unreadMessageCount[i];
        if (msg.groupItem == m[me.getCategoryField()])
        {
          msg.count ++;
          found = true;
          break;
        } 
      }
      if (!found)
      {
        me.unreadMessageCount.push({
          groupItem: m[me.getCategoryField()], 
          count: 1
        });
      }

      me.unreadMessageCount = [].concat(me.unreadMessageCount);
      me.loader.dismiss();
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
        me.unreadMessageCount = m;
      }, 
      e => {}, 
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
