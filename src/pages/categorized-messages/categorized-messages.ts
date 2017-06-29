import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { MessageProvider } from '../../providers/message-provider';
import { Message } from '../../models/message';
// import { CategorizedMessages } from '../../models/categorized-messages';
import { MessagesPage } from '../messages/messages';
import { AuthTestPage } from '../auth-test/auth-test';
/*
  Generated class for the CategorizedMessage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

export enum CategoryMethod
{
  ByAlarmID,
  ByEquipment,
  ByAlarmType
}


@Component({
  selector: 'page-categorized-message',
  templateUrl: 'categorized-messages.html'
})
export class CategorizedMessagesPage {
  categoryMethod = CategoryMethod
  activeMenu : string = "menu1";
  category : CategoryMethod = CategoryMethod.ByAlarmType;
  messages : Message[] = [];
  // categorizedMessage : CategorizedMessages[]
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public provider: MessageProvider) 
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategorizedMessagePage');
    this.menu.enable(true, 'menu1');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter CategorizedMessagePage');
    var me = this;
    this.provider.getMessage().subscribe(
      m => {
        me.messages = [].concat(m);
      });
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
}
