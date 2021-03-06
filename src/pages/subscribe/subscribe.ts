import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { SubscribeEditPage } from '../subscribe-edit/subscribe-edit'
import { GeneralDataProvider } from '../../providers/general-data-provider'
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-subscribe',
  templateUrl: 'subscribe.html'
})
export class SubscribePage {
  alarmtypes : string[] = [];
  searching: boolean = false;
  constructor(public navCtrl: NavController, public provider: GeneralDataProvider, public loading: LoadingController) {
    //   let loader = this.loading.create({
    //     content: 'Loading...',
    //   });

    //  loader.present();
      this.searching = true;
      this.provider.getAlarmTypes().subscribe(
        m => {
          this.searching = false;
          this.alarmtypes = m
          // if(m) loader.dismiss();
          }
      );   
  }

  gotoEdit(alarmtype:string): void
  {
      this.navCtrl.push(SubscribeEditPage, {'alarmtype': alarmtype});
  }

}


