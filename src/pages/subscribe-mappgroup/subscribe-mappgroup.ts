import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlarmAction } from '../../models/alarm-action';

/*
  Generated class for the SubscribeMappgroup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-subscribe-mappgroup',
  templateUrl: 'subscribe-mappgroup.html'
})
export class SubscribeMappgroupPage {
  actionValue: string;
  chatName: string;
  alarmAction: AlarmAction;
  actionType: number;
  pageTitle = "輸入聊天室ID";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.actionType = this.navParams.get("actionType");
    console.log('ionViewDidLoad SubscribeMappgroupPage');
  }


  
  done()
  {
    let callback = this.navParams.get('callback');

    if(callback != null)
    {
      this.alarmAction = {
        actionType: this.actionType, 
        actionValue : this.actionValue, 
        chatName: this.chatName, 
        enabled: true, 
        name:"",
        mailEmpId:"",
        isDept: false
      };
      callback(this.alarmAction).then(()=>{
        this.navCtrl.pop();   
      });
    }
  }

}
