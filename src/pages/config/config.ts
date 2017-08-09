import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Config } from '../../models/config';
import { ConfigProvider } from '../../providers/config-provider';
import { Observable } from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the Config page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

//  items: Group[] = [];
//  items: Employee[] = [];
  config: Config ;
  items: string[] = ['CIM'];
  soundName: string ;
  pageSize: number ;
  soundSwitch: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: ConfigProvider,public alertCtrl: AlertController) {
    this.soundName = "Bell";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
          this.initDB().subscribe(m => { 
          this.provider.getConfig().subscribe(
               m => {
                 console.log("getConfig: " + m.soundName + "," + m.pageSize);
                 this.soundName = m.soundName;
                 this.pageSize = m.pageSize;
                 this.soundSwitch = this.soundName ===''? 0 : 1;
               }
          );

    });
  }

  initDB(): Observable<any>
  {
    console.log('initDB Start..');
    this.soundSwitch = 1;
    this.soundName = 'Bell';
    this.pageSize = 8;
    this.config = {soundSwitch: this.soundSwitch, soundName: this.soundName , pageSize: this.pageSize};
    return this.provider.init(this.config);
  }

  onSelectChange($event)
  {
    this.updateConfig();
  }

  updateConfig()
  {
    console.log('UpdateConfig Start..');
    this.soundName = this.soundSwitch === 0 ? '': this.soundName;
    this.config = {soundSwitch: this.soundSwitch, soundName: this.soundName , pageSize: this.pageSize};
    this.provider.updateConfig(this.config).subscribe(m => {
        console.log("UpdateConfig finish");
        this.provider.getConfig().subscribe(
               m => {
                 this.soundName = m.soundName;
                 this.pageSize = m.pageSize;
                //  this.showAlert();
               }
          );
     });
  }

  // showAlert() {
  //   let alert = this.alertCtrl.create({
  //     title: '變更完成!',
  //     subTitle: '顯示變數已變更',
  //     buttons: ['OK']
  //   });
  //   alert.present();
  // }

  // showPrompt() {
  //   let prompt = this.alertCtrl.create({
  //     title: '顯示筆數',
  //     message: "請輸入數字",
  //     inputs: [
  //       {
  //         name: '8',
  //         placeholder: '8'
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         handler: data => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Save',
  //         handler: data => {
  //           console.log('Saved clicked');
  //         }
  //       }
  //     ]
  //   });
  //   prompt.present();
  // }

  // testClick()
  // {
  //  this.navCtrl.push(GroupSearchPage, {'callback': this.callbackFunction, 'pageTitle': "選擇群組", 'filterGroups': this.items})
  //  this.navCtrl.push(PeopleSearchPage, {'callback': this.callbackFunction, 'pageTitle': "選擇員工", 'filterEmployees': this.items})
  //  this.navCtrl.push(DepartmentSelectPage, {'callback': this.callbackFunction, 'pageTitle': "選擇部門", 'filterDepartments': this.items})
  // }
  
//   callbackFunction = (params) => 
//   {
//      return new Promise((resolve, reject) => {
//             if (params)
//             {
// //              this.groups.push(params);
//               this.items.push(params);
//             }
//             resolve();
//          });
//   }

}
