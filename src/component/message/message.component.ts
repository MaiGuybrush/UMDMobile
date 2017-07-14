import { Component, Input, Output} from '@angular/core';
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
    archived: boolean = false;
    constructor(public provider: MessageProvider)
    {

    }

    getDateFormat(): string
    {
      let dateFormat:string; 
      if (this.itemGroup === 1)
      {
         dateFormat = "shortTime"
      }
      else
      {
         dateFormat = "yyyy-MM-dd HH:mm:ss"
      }
      return dateFormat;
    }
    
    archiveMessage(): void
    {
      var me = this;
      this.provider.archive(this.msg).subscribe(m => me.archived = true);
    }

    restoreMessage(): void
    {
      var me = this;
      this.provider.restore(this.msg).subscribe(m => me.archived = false);
    }

    pushMsgDetailPage(): void
    {
        this.navCtrl.push(MessagesDetailPage, {'msg': this.msg})
    }

}