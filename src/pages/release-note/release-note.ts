import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config-provider';
import { AppVersion } from '@ionic-native/app-version';

/**
 * Generated class for the ReleaseNotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-release-note',
  templateUrl: 'release-note.html',
})
export class ReleaseNotePage {
  private neverShowAgain: boolean;
  private platformType: string;
  private settings: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform
    , public config: ConfigProvider, public appVersion: AppVersion ) {
      this.settings = config.getConfig();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReleaseNotePage');
    
    if (this.platform.is('ios'))
    {
      this.platformType = 'ios';
    } else if (this.platform.is('android'))
    {
      this.platformType = 'android';      
    }
  }

  ionViewDidLeave() {
    if (this.neverShowAgain)
    {
      let settings = this.config.getConfig();
      this.appVersion.getVersionNumber().then(m => {
        settings.lastViewAppVersion = m;
        this.config.updateConfig(settings).subscribe(
        m => {}, 
        e => {
            console.log("ReleaseNotePage update Config fail!")
        });    
      });
    }
  }
}
