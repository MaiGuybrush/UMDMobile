import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Config } from '../../models/config';
import { ConfigProvider } from '../../providers/config-provider';
import { Observable } from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


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

  config: Config = {soundSwitch: true, soundName: 'bell', pageSize: 8};
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, 
              public configProvider: ConfigProvider, public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');

    this.configProvider.getConfig().subscribe( m => { 
        this.config = m;
        // console.log('Your config is', m);
         console.log('getConfig config is', this.config);
    }); 

    // this.config = this.configProvider.getConfig();
    // console.log('Your co。nfig is', this.config);

  }

  updateConfig(config:Config)
  {
    this.configProvider.updateConfig(config).subscribe();
  }
  

}
