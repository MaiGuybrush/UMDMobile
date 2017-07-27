import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { LoadingController } from 'ionic-angular';
import { Push } from '@ionic-native/push';

//import { AuthTestPage } from '../auth-test/auth.test';
import { CategorizedMessagesPage } from '../categorized-messages/categorized-messages';
import { SubscribePage } from '../subscribe/subscribe';
import { GroupsPage } from '../groups/groups';
import { ConfigPage } from '../config/config';
import { AccountProvider } from '../../providers/account-provider'
import { EmployeeProvider } from '../../providers/employee-provider'
import { MessageProvider } from '../../providers/message-provider'
import { Platform, AlertController } from "ionic-angular"
import { InxAccount } from '../../models/inx-account'

declare var window;

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
  constructor(public platform: Platform, public alertCtrl: AlertController, private push: Push
    , public loading: LoadingController, public accountProvider: AccountProvider
    , public employeeProvider: EmployeeProvider, public messageProvider: MessageProvider) {
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {    
    });
  }

  // ionViewCanEnter(): boolean
  // {

  // }  
}
