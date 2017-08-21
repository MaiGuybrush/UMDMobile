import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Config } from '../../models/config';
import { Observable } from 'rxjs/Rx';

/**
 * Generated class for the ConfigComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'config',
  templateUrl: 'config.component.html'
})
export class ConfigComponent {

  @Input()
  // config: Observable<Config>;
  config: Config;
  @Output() updateClick = new EventEmitter<Config>();

  constructor() {}

   triggerClick()
   {
        this.updateClick.emit(this.config);
   }

}

