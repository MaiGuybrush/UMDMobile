import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormControl } from '@angular/forms'
import { LoadingController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { CategoryMethod } from '../../components/message-category/message-category.component'
import { MessageProvider } from '../../providers/message-provider'
import { Message } from '../../models/message';
import { Observable } from 'rxjs/Rx';
import { Content } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {
  @ViewChild(Content) content: Content;
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController,
              public messageProvider: MessageProvider, public loading: LoadingController) {
    this.categoryMethod = this.navParams.get('categoryMethod');
    this.categoryValue = this.navParams.get('categoryValue');
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
    // let loader = this.loading.create({
    //   content: '正在載入訊息..',
    // });


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
    this.subscription = this.messageProvider.getMessageNotifier().subscribe(m => {
      if (m.readCount > 0) //>0 表示不是新訊息
      {
        for (let i = 0; i < this.messages.length; i++)
        {
          if (m.id === this.messages[i].id)
          {
            this.messages[i] = m; 
            this.messages = [].concat(this.messages);
            break;
          }
        }
      }
      else //新訊息
      {
        this.messages = [m].concat(this.messages);
      }
    });


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

  appendMessage(message: Message[])
  {
    this.messages = [].concat(this.messages).concat(message)
    // console.log("appendMessage:" , message );
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

      setTimeout(() => {
        this.queryMessageByPage().subscribe(m => {
            this.appendMessage(m);
            console.log('Async operation has ended:' + this.messages.length);
            infiniteScroll.complete();
        });
      }, 500);
  }

  scrollToTop() {
    this.content.scrollToTop();
  }


}
