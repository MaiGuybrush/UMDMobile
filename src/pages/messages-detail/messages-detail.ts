import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { MessageProvider } from '../../providers/message-provider'
import { PushProvider } from '../../providers/push-provider'
import { AccountProvider } from '../../providers/account-provider'
// import { MessageProvider } from '../../mocks/providers/message.provider'
import { Message } from '../../models/message';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'page-messages-detail',
  templateUrl: 'messages-detail.html',
  animations: [
    trigger('itemState', [
      state('normal', style({opacity: 1, transform: 'translateX(0)'})),
      transition("* => hideLeft", [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.2s ease-in')
      ]),
      transition("normal => hideRight", [
        style({
          opacity: 0,
          transform: 'translateX(100%)'
        }),
        animate('0.2s ease-in')
      ]),
      transition("normal => leftBound", [
        animate('0.1s', style({
          transform: 'translateX(-30%)'
        })),
        animate('0.1s', style({
          transform: 'translateX(30%)'
        })),
      ]),
      transition("normal => rightBound", [
        animate('0.1s', style({
          transform: 'translateX(30%)'
        })),
        animate('0.1s', style({
          transform: 'translateX(-30%)'
        })),
      ]),
      transition("* => normal", [
        animate('0.2s ease-out', style({opacity: 1, transform: 'translateX(0)'}))
      ]),
    ])
  ]    

})
export class MessagesDetailPage {
  messages: Message[];
  index: number;
  msg: Message
  itemState: string = "normal";
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController
    , public messageProvider: MessageProvider, public pushProvider: PushProvider, public accountProvider: AccountProvider ) {
    this.msg = this.navParams.get('msg')
    this.messages = this.navParams.get('messages')
    this.index = this.navParams.get('index')
  }

  ionViewDidLoad() {
//    var me = this;
  }

  setMessageRead()
  {
    if (!this.msg.read)
    {
      this.msg.read = true;   
      this.messageProvider.updateMessageRead([this.msg]).subscribe(
        m => { 
          this.pushProvider.increaseBadgeCount(-1).subscribe();
        },
        e => {
          console.log("setMessageRead error, e=/" + JSON.stringify(e) + "/.")
        }
      );
    }
  }

  ionViewDidEnter() {
    this.itemState = "normal";
    this.setMessageRead();
  }
    
  swipeHandler(event) {
    if (event.offsetDirection == 4 && this.index < this.messages.length - 1)
    {
      ++this.index;
      this.itemState = "hideLeft";
    }
    else if (event.offsetDirection == 2 && this.index > 0)
    {
      --this.index;
      this.itemState = "hideRight";
    }
  } 
  animationDone(event)
  {
    if (event.toState == "hideLeft" || event.toState == "hideRight")
    {
      this.msg = this.messages[this.index];    
      this.setMessageRead();
      this.itemState = "normal";
    }
  }
}
