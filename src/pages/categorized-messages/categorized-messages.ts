import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { MessageProvider } from '../../providers/message-provider';
import { Message } from '../../models/message';
import { CategoryMethod } from '../../component/message-category/message-category.component';
import { MessagesPage } from '../messages/messages';
import { AuthTestPage } from '../auth-test/auth-test';
import { Subscription } from 'rxjs/Subscription';
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
  category : CategoryMethod = CategoryMethod.ByAlarmType;
  // messages : Message[] = [];
  unreadMessageCount: { groupItem:string, count: number }[]
  subscription : Subscription;
  // categorizedMessage : CategorizedMessages[]
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public provider: MessageProvider) 
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategorizedMessagePage');
    this.menu.enable(true, 'menu1');
    var me = this;
    this.subscription = this.provider.getMessageNotifier().subscribe(m => {
      let found = false;
      for (let i = 0; i < this.unreadMessageCount.length; i++) {
        let msg = this.unreadMessageCount[i];
        if (msg.groupItem == m[this.getCategoryField()])
        {
          msg.count ++;
          found = true;
          break;
        } 
      }
      if (!found)
      {
        this.unreadMessageCount.push({
          groupItem: m[this.getCategoryField()], 
          count: 1
        });
      }

      me.unreadMessageCount = [].concat(this.unreadMessageCount);
      // this.messages.push(m);
      // this.messages = [].concat(this.messages);
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter CategorizedMessagePage');

    // this.provider.getAllMessage().subscribe(
    //   m => {
    //     this.messages = [].concat(m);
    //   });
    var me = this;
    this.provider.getUnreadMessageCount(this.getCategoryField()).subscribe(
      m => {
        me.unreadMessageCount = m;
      }
    );
    
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  insertTestMessages()
  {
    this.provider.insertTestMessages().subscribe();
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


}
