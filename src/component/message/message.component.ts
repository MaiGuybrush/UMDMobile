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
    @Input()
    showDate: string;
 
    sameDate: boolean;
    // read: boolean = false;
    constructor(public provider: MessageProvider)
    {
    }


    ngOnInit() {
       this.sameDate = this.msg.sameDate;
    }

    // getReadColor(): string
    // {
    //    if (this.read) {
    //      return "yellow1";
    //    }else
    //    {
    //      return "red1";
    //    }
    // }



  //  ngAfterViewChecked()
  // {
  //   console.log( "! changement de la date du composant !" );
  //   this.divider = this.showDivider;
  // }

  //   ngOnChanges() {
  //    this.showDivider =this.showDivider;
  //   }

    // getDateFormat(): string
    // {
    //   let dateFormat:string; 
    //   if (this.showDate === 'Today')
    //   {
    //      dateFormat = "shortTime"
    //   }
    //   else
    //   {
    //      dateFormat = "yyyy-MM-dd HH:mm:ss"
    //   }
    //   return dateFormat;
    // }
    
    archiveMessage(): void
    {
      var me = this;
      this.provider.archive(this.msg).subscribe(
        m => {
          me.msg.archived = true;
        },
        e => {
          console.log("archiveMessage error, e=/" + e.stringify() + "/.")
        }
      );
    }

    restoreMessage(): void
    {
      var me = this;
      this.provider.restore(this.msg).subscribe(
        m => {
          me.msg.archived = false;
        },
        e => {
          console.log("restoreMessage error, e=/" + e.stringify() + "/.")
        }       
      );
    }

    pushMsgDetailPage(): void
    {
        this.navCtrl.push(MessagesDetailPage, {'msg': this.msg})
    }

}