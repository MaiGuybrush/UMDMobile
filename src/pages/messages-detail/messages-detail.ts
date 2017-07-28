import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { MessageProvider } from '../../providers/message-provider'
// import { MessageProvider } from '../../mocks/providers/message.provider'
import { Message } from '../../models/message';
@Component({
  selector: 'page-messages-detail',
  templateUrl: 'messages-detail.html'
})
export class MessagesDetailPage {
  msg: Message
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public messageProvider: MessageProvider ) {
    this.msg = this.navParams.get('msg');
  }

  ionViewDidLoad() {
    var me = this;
    this.messageProvider.setMessageRead([this.msg]).subscribe(
      m => {
        me.msg.read = true;        
      },
      e => {
        console.log("setMessageRead error, e=/" + e.stringify() + "/.")
      }
    );
  }
}
