import { Component, Input} from '@angular/core';
// import { NavController } from 'ionic-angular'
import { Subscribe } from '../../models/subscribe'

/**
 * Generated class for the NosubscriptionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'nosubscription',
  templateUrl: 'nosubscription.component.html'
})
export class NosubscriptionComponent {
  @Input()
  nosubscription: Subscribe;
  // @Input()
  // navCtrl: NavController;  

  constructor() {
  }

}
