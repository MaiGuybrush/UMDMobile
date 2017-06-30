import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
// import { MessageProvider } from '../../mocks/providers/message.provider'
import { Message } from '../../models/message';
import { Observable } from 'rxjs/Rx'
import { MessageProvider } from '../../providers/message-provider'

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {
  messages: Message[] = []
  queryPage: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController,
              public provider: MessageProvider) {
  }

  ionViewDidLoad() {
       console.log('ionViewDidLoad MessagePage');
       this.messages = this.navParams.get('messages');
       this.queryPage = 2;
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

      setTimeout(() => {
       this.provider.getMessagebyPage(this.queryPage).subscribe( m => {
        this.messages = this.messages.concat(m);
        this.queryPage += 1;
        console.log('Async operation has ended:' + this.messages.length);
         infiniteScroll.complete();
       });
      }, 500);
  }


}
