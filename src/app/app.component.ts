import { Component, ViewChild } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'
import { Platform, Nav, AlertController } from "ionic-angular"
import { LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { DetailsPage } from "../pages/details/details"
import { InitPage } from "../pages/init/init"
import { TabsPage } from '../pages/tabs/tabs'
//import { PeopleSearchPage } from '../pages/people-search/people-search'
import { GroupSearchPage } from '../pages/group-search/group-search'
import { ConfigPage } from '../pages/config/config';
import { ExtraInfoProvider } from '../providers/extrainfo-provider'
import { MessageProvider } from '../providers/message-provider';
import { AccountProvider } from '../providers/account-provider'
import { EmployeeProvider } from '../providers/employee-provider'
import { InxAccount } from '../models/inx-account'
import { Message } from '../models/message'
import { Observable } from 'rxjs/Rx'
import { Api } from './api'

declare var window;

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = InitPage;
  constructor(public http: Http, public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen
      , public loading: LoadingController, public accountProvider: AccountProvider
      , public employeeProvider: EmployeeProvider, public messageProvider: MessageProvider, private push: Push) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });
  }

    // setDeviceToken(empId:string, DeviceToken: string) : Observable<string>
    // {
    //    let headers = new Headers({ 'Content-Type': 'application/json' });
    //    let options = new RequestOptions({ headers: headers });

    //     let url = 'http://c4c010685.cminl.oa/UMD/Services/UMDDataService.svc/UpdateUserInfo';

    //    let body = {"EmpId": `${empId}`, "DeviceToken": `${DeviceToken}`};
    //   //  let output = [];
    //    let err = "";
    //    console.log('post start');
    //    return this.http.post(url, body, options).map(res => 
    //                     Api.toCamel(res.json()).IsSuccess
    //                   );
  // }
}