import { Component, Input} from '@angular/core';
import { NavController } from 'ionic-angular';

import { MessageProvider } from '../../providers/message-provider'
import { MessagesDetailPage } from '../../pages/messages-detail/messages-detail'
import { Message } from '../../models/message';
import * as moment from 'moment'
// import { ChangeDetectorRef} from '@angular/core';

@Component({
    selector: 'message',
    templateUrl: './message.component.html'
})
export class MessageComponent
{
    
    @Input()
    msg: Message;
    // @Input()
    // prevMsg: Message;
    @Input()
    navCtrl: NavController;
    // @Input()
    // isNewMsg: boolean;
    // @Input()
    // showDate: string;
    

    // sameDate: boolean;
    // showDate: string;
    occurDT : Date;
    // read: boolean = false;
    constructor(public provider: MessageProvider)
    {
    }


    // ngOnInit() {
    //   this.sameDate = this.msg.sameDate;
    //   this.occurDT = moment.utc(this.msg.occurDT).toDate();
    // //  this.getShowDate();
  
    //   //  console.log ('occurDT:' + this.occurDT );

    //   // this.sameDate = this.isSameDate(this.msg, this.prevMsg);
    // }

    // getShowDate()
    // {
    //   let today = new Date(Date.now());
    //   let occurtDt = new Date(this.msg.occurDT);
    //   if (occurtDt.getMonth() === today.getMonth() && occurtDt.getDate() === today.getDate()){
    //     this.showDate ='今天';
    //   }else{
    //     this.showDate = occurtDt.getFullYear() + "/" + (Number(occurtDt.getMonth()) + 1).toString()  + "/" + occurtDt.getDate() ;
    //   }
    //   this.occurDT = moment.utc(this.msg.occurDT).toDate();
    // }

    // isSameDate(message: Message, prevMessage: Message): boolean
    // {
    //   if (!this.isNewMsg)
    //   {
    //     let occurDT = new Date(message.occurDT);
    //     let prevOccurDT = new Date(prevMessage.occurDT);
      
    //     return prevMessage && (occurDT.getMonth() === prevOccurDT.getMonth() && occurDT.getDate() === prevOccurDT.getDate())
    //   }else
    //   {
    //     this.sameDate = true;
    //   }
    // }
    
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