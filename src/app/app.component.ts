import { Component, ViewChild } from '@angular/core'
import { Platform, Nav } from "ionic-angular"
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { InitPage } from "../pages/init/init"

declare var window;

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
  rootPage = 'InitPage';

  @ViewChild(Nav) nav: Nav;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
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