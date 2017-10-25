import { Component, ViewChild, ViewChildren, QueryList, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormControl } from '@angular/forms'
import { LoadingController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { CategoryMethod } from '../../components/message-category/message-category.component'
import { MessageComponent } from '../../components/message/message.component'
import { MessageItemEvent } from '../../components/message/message-item-event'
import { MessageProvider } from '../../providers/message-provider'
import { PushProvider } from '../../providers/push-provider'
import { Message } from '../../models/message';
import { MessagesDetailPage } from '../messages-detail/messages-detail'
import { Observable } from 'rxjs/Rx';
import { Content } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment'
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
  animations: [
    trigger('itemState', [
      state("void", style({height: 0})),
      transition('* => void', animate('500ms'))
    ])
  ]    
})
export class MessagesPage {
  @ViewChild(Content) content: Content;
  @ViewChildren(MessageComponent) messageChildren: QueryList<MessageComponent>;
  messages: Message[] = []
  queryPage: number;
  categoryMethod: CategoryMethod;
  categoryValue: string;
  showDate: string ='';
  dates: string[] =[];
  pattern : string = undefined;
  searchControl: FormControl;
  subscription : Subscription;
  searching: boolean = false;
  checkedMessages: Set<MessageComponent> = new Set<MessageComponent>();
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController,public zone: NgZone, 
              public messageProvider: MessageProvider, public loading: LoadingController, public pushProvider: PushProvider) {
    this.categoryMethod = this.navParams.get('categoryMethod');
    this.categoryValue = this.navParams.get('categoryValue');
    this.searchControl = new FormControl();
  }

  private isSameDate(date1: Date, date2: Date): boolean
  {
    return moment(date1).utc().format('YYYYMMDD') == moment(date2).utc().format('YYYYMMDD')
  }

  private getDateString(date: Date): string
  {
    let today = new Date(Date.now());
    if (this.isSameDate(today, date)){
        return '今天';
    }else{
        return moment(date).utc().format('YYYY-MM-DD');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
    this.menu.enable(true, 'menu-message');
    // let loader = this.loading.create({
    //   content: '正在載入訊息..',
    // });
    // let messageChildren = this.messageChildren.toArray();
    // messageChildren.forEach(
    //   (m, index) => {
    //     if (index === 0 || this.isSameDate(m.msg.occurDT, messageChildren[index - 1].msg.occurDT)) {
    //       m.showDate = this.getDateString(m.msg.occurDT);
    //     }
    //     else { 
    //       m.showDate = undefined;
    //     }
    //   }
    // );
    if (!this.pattern) {
              this.searching = true;
              this.queryPage =1;
              this.queryMessageByPage().subscribe(m => {
                  this.searching = false;
                  this.appendMessage(m);
              });; 
        // loader.dismiss();
    }

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
            this.searching = false;
            if (!search) this.pattern = undefined;
              this.queryMessageByPage().subscribe(m => {
                  this.appendMessage(m);
              });; 
    });    
  }

  ionViewDidEnter()
  {
    console.log('ionViewDidEnter MessagesPage');
    this.subscription = this.messageProvider.getMessageNotifier().subscribe(m => this.zone.run(() => {
      // if (m.readCount > 0) //>0 表示不是新訊息
      // {
      //   for (let i = 0; i < this.messages.length; i++)
      //   {
      //     if (m.id === this.messages[i].id)
      //     {
      //       this.messages[i] = m; 
      //       this.messages = [].concat(this.messages);
      //       break;
      //     }
      //   }
      // }
      // else //新訊息
      // {
//          let messageChildren = this.messageChildren.toArray();
//          messageChildren[0].showDate = undefined;
        this.messages = [m].concat(this.messages);
      // }
    }));


  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }


  onSearchInput()
  {
    this.searching = true;
    this.queryPage =1;
    this.messages = [];
    this.dates = [];
  }

  queryMessageByPage(): Observable<Message[]>
  {
    switch(this.categoryMethod)
    {
    case CategoryMethod.AlarmType:
        return this.messageProvider.getMessages(this.queryPage++, this.categoryValue, undefined, undefined, this.pattern);
    case CategoryMethod.Equipment:
        return this.messageProvider.getMessages(this.queryPage++, undefined, this.categoryValue, undefined, this.pattern);
    case CategoryMethod.AlarmID:
        return this.messageProvider.getMessages(this.queryPage++, undefined, undefined, this.categoryValue, this.pattern);
    } 
  }

  onDelete(msg: Message)
  {
      let loader = this.loading.create({
        content: '正在刪除...'
      });
      this.messageProvider.delete(msg.rowid).subscribe(m => {
        this.messages.forEach((searchMsg, idx) => {
          if (searchMsg.rowid == msg.rowid) 
          {
            this.messages.splice(idx, 1);
          }
        })
        loader.dismiss();
      }, e => {
        console.log(`[messages.ts]delete message error! err="${e}"`);
        loader.dismiss();
      }, () => {
        loader.dismiss();
      });    
  }



  getMsgDate(msg: Message): string
  {
       let today = new Date(Date.now());
        if (msg.occurDT.getMonth() === today.getMonth() && msg.occurDT.getDate() === today.getDate()){
            this.showDate ='今天';
        }else{
            this.showDate = msg.occurDT.getFullYear() + "/" + (Number(msg.occurDT.getMonth()) + 1).toString()  + "/" + msg.occurDT.getDate() ;
        }
        this.getShowDivider(msg);
        return this.showDate;
  }

  getShowDivider(msg: Message)
  {       
        let existed:boolean = false;
        this.dates.forEach(date => {
            if (date === this.showDate) existed = true;
        });
        
        if (!existed)
        {
           this.dates.push(this.showDate);
           msg.sameDate = false;
        }else
        {
           msg.sameDate = true;
        }
  }

  animationDone(event: any)
  {

  }

  appendMessage(message: Message[])
  {
    this.messages = [].concat(this.messages).concat(message)
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

      setTimeout(() => {
        this.queryMessageByPage().subscribe(m => {
            console.log('Async operation has ended:' + this.messages.length);
            this.appendMessage(m);
            infiniteScroll.complete();
        });
      }, 500);
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  archiveMessages(archiveMessages: Message[])
  {
    let unreadCount = 0;
    archiveMessages.forEach(m => {
      if (!m.read)
      {
        unreadCount++;
      }
      m.archived = true;
    })
    if (archiveMessages.length > 0)
    {
      this.messageProvider.updateMessageArchive(archiveMessages).subscribe(
        m => { 
            this.pushProvider.increaseBadgeCount(-1 * unreadCount).subscribe();
            for (let i = 0; i < archiveMessages.length; i++)
            {
              let idx = this.messages.indexOf(archiveMessages[i]);
              if (idx >= 0)
              {
                this.messages.splice(idx, 1);              
              }
            }
        },
        e => {
          console.log("archiveMessages error, e=/" + JSON.stringify(e) + "/.")
        }
      );
    }
  }

  messageSwipeHandler(event)
  {
    let messageComponent = event.source;
    if (messageComponent.msg.archived)
    {
      return;
    }
    messageComponent.msg.archived = true;
    let messages = [messageComponent.msg];
    if(messageComponent.isChecked())
    {
      this.checkedMessages.delete(messageComponent);    
    }
    this.archiveMessages(messages)
  }

  messageClickHandler(event)
  {
    let msg = event.message;
    this.navCtrl.push(MessagesDetailPage, {'msg': msg, 'messages': this.messages, 'index':this.messages.indexOf(msg) })
  }

  messageCheckHandler(event: MessageItemEvent)
  {
    if (event.check)
    {
      this.checkedMessages.add(event.source);
    }
    else
    {
      this.checkedMessages.delete(event.source);
    }    
  }

  setCheckedArchive()
  {
    let messages: Message[] = [];
    this.checkedMessages.forEach((m) => {
      messages.push(m.msg);
    });
    this.checkedMessages.clear();          
    this.archiveMessages(messages);
    // if (messages.length > 0)
    // {
    //   this.messageProvider.updateMessageArchive(messages).subscribe(
    //     m => { 
    //       this.pushProvider.increaseBadgeCount(-1 * unreadCount).subscribe();
    //     },
    //     e => {
    //       console.log("setCheckedArchive error, e=/" + JSON.stringify(e) + "/.")
    //     }
    //   );
    // }

  }
  
  setCheckedRead()
  {
    let messages: Message[] = [];
    this.checkedMessages.forEach((m) => {
      if (!m.msg.read)
      {
        m.msg.read = true;
        m.setMessage(m.msg);
        messages.push(m.msg);
      }
    });
    if (messages.length > 0)
    {
      this.messageProvider.updateMessageRead(messages).subscribe(
        m => { 
          this.pushProvider.increaseBadgeCount(messages.length).subscribe();
        },
        e => {
          console.log("setCheckedRead error, e=/" + JSON.stringify(e) + "/.")
        }
      );
    }
  }

  setAllRead()
  {
    switch(this.categoryMethod)
    {
    case CategoryMethod.AlarmType:
        return this.messageProvider.setAllMessagesRead(this.categoryValue, undefined, undefined);
    case CategoryMethod.Equipment:
        return this.messageProvider.setAllMessagesRead(undefined, this.categoryValue, undefined);
    case CategoryMethod.AlarmID:
        return this.messageProvider.setAllMessagesRead(undefined, undefined, this.categoryValue);
    } 
    
  }

  checkAll()
  {
    if (!this.messageChildren)
    {
      return
    }
    this.messageChildren.forEach((m, i, array) => {
      if (!m.msg.archived && !m.isChecked())
      {
        m.setChecked(true);
        this.checkedMessages.add(m);
      }
    })
  }
}
