import { Component, Input, Output, EventEmitter} from '@angular/core';
import { AlarmAction } from '../../models/alarm-action'

/**
 * Generated class for the NosubscriptionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'alarmAction',
  templateUrl: 'alarm-action.component.html'
})
export class AlarmActionComponent {
  @Input()
  alarmAction: AlarmAction;
  @Output() deleteClick = new EventEmitter<AlarmAction>();

  constructor() {
  }

}
