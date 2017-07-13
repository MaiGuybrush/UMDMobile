import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { CategoryMethod } from '../../component/message-category/message-category.component'
import { MessageProvider } from '../../providers/message-provider'
import { Message } from '../../models/message';
import { Observable } from 'rxjs/Rx'

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {
  messages: Message[] = []
  todayMsgs: Message[] = []
  queryPage: number;
  categoryMethod: CategoryMethod;
  categoryValue: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController,
              public messageProvider: MessageProvider, public loading: LoadingController) {
    this.categoryMethod = this.navParams.get('categoryMethod');
    this.categoryValue = this.navParams.get('categoryValue');
    this.queryPage = 1;
  }

  queryMessageByPage(): Observable<Message[]>
  {
    switch(this.categoryMethod)
    {
    case CategoryMethod.ByAlarmType:
        return this.messageProvider.getMessage(this.queryPage, this.categoryValue, undefined, undefined);
    case CategoryMethod.ByEquipment:
        return this.messageProvider.getMessage(this.queryPage, undefined, this.categoryValue, undefined);
    case CategoryMethod.ByAlarmID:
        return this.messageProvider.getMessage(this.queryPage, undefined, undefined, this.categoryValue);
    }
  }

  ionViewDidLoad() {
    let loader = this.loading.create({
      content: '正在載入訊息..',
    });
    this.queryMessageByPage().subscribe(m => {
      this.appendMessage(m);
      this.filterDate();
      loader.dismiss();
    });;
  }

  filterDate()
  {
    let today = new Date(Date.now());
    for (let i=this.messages.length-1; i>=0;i--) {
        if (this.messages[i].occurDT.getMonth() === today.getMonth() && this.messages[i].occurDT.getDate() === today.getDate()){
              this.todayMsgs = this.todayMsgs.concat(this.messages[i]);
              this.messages.splice(i,1); 
        }
    }
  } 

  appendMessage(message: Message[])
  {
    this.messages = [].concat(this.messages).concat(message)
    this.queryPage++;
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

      setTimeout(() => {
        this.queryMessageByPage().subscribe(m => {
            console.log('Async operation has ended:' + this.messages.length);
            this.appendMessage(m);
            this.filterDate();
            infiniteScroll.complete();
        });
      }, 500);
  }


}
