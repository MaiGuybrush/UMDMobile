import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ExtraInfoProvider } from '../../providers/extrainfo-provider';
import { AppConfig } from '../../providers/app-config';
declare var ExtraInfo: any;

@Component({
  selector: 'page-auth-test',
  templateUrl: 'auth-test.html'
})
export class AuthTestPage {
  constructor(public extraInfo:ExtraInfoProvider, public navCtrl: NavController, public appConfig: AppConfig) {
  }
  result = {
      apiResult : "123",
      apiError: "456"
  }

  ionViewDidLoad() {
  }
  getUserInfo()
  {
      this.extraInfo.getUserInfo().subscribe(result => 
        this.result = {
                      apiResult: JSON.stringify(this.extraInfo),// JSON.stringify(result);
                      apiError: undefined
                    }
      , (err) => {
        this.result.apiError = JSON.stringify(err);
      });
    //   this.extraInfo.getUserInfo(this.appID).then((result) => {
    //       this.apiResult = JSON.stringify(result);
    //   }, (err) => {
    //       this.apiError = err;
    //   });
  };
  verifyWithAppID()
  {
      var me: AuthTestPage = this;
      this.extraInfo.verifyWithAppID().subscribe((result) => {
        me.result.apiResult = JSON.stringify(me.extraInfo);// JSON.stringify(result);
      }, (err) => {
        me.result.apiError = JSON.stringify(err);
      });
      // this.extraInfo.verifyWithAppID(this.appID).then((result) => {
      //     this.apiResult = JSON.stringify(result);
      // }, (err) => {
      //     this.apiError = err;
      // });  
  };

  clear ()
  {
    this.result.apiResult = "";
    this.result.apiError = "";    
  }

}
