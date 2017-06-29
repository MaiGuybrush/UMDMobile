import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { LoadingController } from 'ionic-angular';

//import { AuthTestPage } from '../auth-test/auth.test';
import { CategorizedMessagesPage } from '../categorized-messages/categorized-messages';
import { SubscribePage } from '../subscribe/subscribe';
import { GroupsPage } from '../groups/groups';
import { ConfigPage } from '../config/config';
import { AccountProvider } from '../../providers/account-provider'
import { EmployeeProvider } from '../../providers/employee-provider'
import { Platform, Nav, AlertController } from "ionic-angular"
import { InxAccount } from '../../models/inx-account'
import { MyApp } from '../../app/app.component'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = CategorizedMessagesPage;
    tab2Root: any = SubscribePage;
    tab3Root: any = GroupsPage;
    tab4Root: any = ConfigPage;
    user: Observable<InxAccount>;
  constructor(public platform: Platform, public alertCtrl: AlertController
    , public loading: LoadingController, public accountProvider: AccountProvider
    , public employeeProvider: EmployeeProvider) {
        this.platform.ready().then((readySource) => {
       let loader = this.loading.create({
      content: '正在取得使用者資訊...',
    });

    loader.present();
    let me = this;
    this.accountProvider.getUserInfo().subscribe(m => {
      console.log("get user [" + `${m.comid}` + "] logged in.");
      this.employeeProvider.updateEmployeeInfo(m.comid, MyApp.fcmRegistrationId)
        .subscribe(m => { },
        e => {
          console.log("update user info fail");
        }
        );

      loader.dismiss();
    }, e => {
      loader.dismiss()
      let alert = this.alertCtrl.create({
        title: '無法取得使用者資訊',
        subTitle: '請確認是否安裝INX App Store!',
        buttons: [{
          text: '結束',
          handler: () => {
            me.platform.exitApp();
          }
        }]
      });
      alert.present();
    });
    });
  }

  ionViewDidLoad() {
  

  }
  // ionViewCanEnter(): boolean
  // {

  // }  
}
