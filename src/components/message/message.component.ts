import { Component, Input, Output, EventEmitter, NgZone} from '@angular/core';
import { Observable } from 'rxjs/Rx'

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { NavController } from 'ionic-angular';

import { MessageProvider } from '../../providers/message-provider'
import { MessagesDetailPage } from '../../pages/messages-detail/messages-detail'
import { Message } from '../../models/message';
import { MessageItemEvent } from './message-item-event'
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
    @Output()
    itemClicked: EventEmitter<MessageItemEvent> = new EventEmitter<MessageItemEvent>();
    @Output()
    itemChecked: EventEmitter<MessageItemEvent> = new EventEmitter<MessageItemEvent>();
    @Output()
    itemSwiped: EventEmitter<MessageItemEvent> = new EventEmitter<MessageItemEvent>();
    // @Output()
    // itemArchivedComp: EventEmitter<MessageItemEvent> = new EventEmitter<MessageItemEvent>();

    private checked: boolean;

    // read: boolean = false;
    constructor(public provider: MessageProvider, public zone: NgZone)
    {
    }


    ngOnInit() {
      this.checked = false
    }
    
    public swipeHandler(event): void
    {
      // this.provider.archive(this.msg).subscribe(
      //   m => {
      //     this.msg.archived = true;
      //   },
      //   e => {
      //     console.log("archiveMessage error, e=/" + JSON.stringify(e) + "/.")
      //   }
      // );
      this.itemSwiped.emit({message: this.msg, source: this, check: undefined});
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

    // pushMsgDetailPage(): void
    // {
    //     this.navCtrl.push(MessagesDetailPage, {'msg': this.msg})
    // }

    getColorByRead() : string 
    {
      if (!this.msg.read)
      {
        return "red2"
      }
      else
      {
        return "gray"
      }

    }

    getColorByCheck() : string
    {
      if (this.checked)
      {
        return "secondary"
      }
      else
      {
        return this.getColorByRead();
      }        
    }

    public setMessage(msg: Message)
    { 
        this.zone.run( () => {
          this.msg = msg;                  
        })
    }

    public isChecked(): boolean
    {
        return this.checked;
    }    

    public setChecked(check: boolean)
    {
      this.checked = check;
    }

    // animationDone(event)
    // {
    //   Observable.interval(1000).subscribe(m => {
    //     this.itemArchivedComp.emit({message: this.msg, source: this, check: undefined});
    //   });
    // }

    clickHandler()
    {
        this.itemClicked.emit({message: this.msg, source: this, check: undefined});
    }

    checkHandler()
    {
      this.checked = !this.checked;
      this.itemChecked.emit({message: this.msg, check: this.checked, source: this})
    }

}