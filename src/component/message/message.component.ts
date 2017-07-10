import { Component, Input, Output, EventEmitter} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MessageProvider } from '../../providers/message-provider'
import { MessagesDetailPage } from '../../pages/messages-detail/messages-detail'
import { Message } from '../../models/message';

@Component({
    selector: 'message',
    templateUrl: './message.component.html'
})
export class MessageComponent
{
    
    @Input()
    msg: Message;
    @Input()
    itemGroup: number;
    @Input()
    navCtrl: NavController;
    @Output()
    itemLongPress = new EventEmitter();
    constructor(public provider: MessageProvider, public loading: LoadingController)
    {
    }

    deleteMessage(): void
    {
    }

    getDateFormat(): string
    {
      let dateFormat:string; 
      if (this.itemGroup === 1)
      {
         dateFormat = "shortTime"
      }else
      {
         dateFormat = "yyyy-MM-dd HH:mm:ss"
      }
      return dateFormat;
    }

    pushMsgDetailPage(): void
    {
        this.navCtrl.push(MessagesDetailPage, {'msg': this.msg})
    }

}