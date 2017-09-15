import { Component, Input} from '@angular/core';
import { NavController } from 'ionic-angular';

import { MessageProvider } from '../../providers/message-provider'
import { MessagesDetailPage } from '../../pages/messages-detail/messages-detail'
import { Message } from '../../models/message';
// import { ChangeDetectorRef} from '@angular/core';

@Component({
    selector: 'message',
    templateUrl: './message.component.html'
})
export class MessageComponent
{
    
    @Input()
    msg: Message;
    @Input()
    navCtrl: NavController;
 
    // read: boolean = false;
    constructor(public provider: MessageProvider)
    {
    }


    ngOnInit() {
    }
    
    archiveMessage(): void
    {
      this.provider.archive(this.msg).subscribe(
        m => {
          this.msg.archived = true;
        },
        e => {
          console.log("archiveMessage error, e=/" + JSON.stringify(e) + "/.")
        }
      );
    }

    restoreMessage(): void
    {
      this.provider.restore(this.msg).subscribe(
        m => {
          this.msg.archived = false;
        },
        e => {
          console.log("restoreMessage error, e=/" + JSON.stringify(e) + "/.")
        }       
      );
    }

    pushMsgDetailPage(): void
    {
        this.navCtrl.push(MessagesDetailPage, {'msg': this.msg})
    }

}