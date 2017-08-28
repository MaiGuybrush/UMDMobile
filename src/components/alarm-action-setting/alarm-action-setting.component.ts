import { Component, Input, Output, EventEmitter} from '@angular/core';
import { AlarmActionSetting } from '../../models/alarm-action-setting'

/**
 * Generated class for the NosubscriptionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'alarmActionSetting',
  templateUrl: 'alarm-action-setting.component.html'
})
export class AlarmActionSettingComponent {
  @Input()
  alarmActionSetting: AlarmActionSetting;
  @Input()
  accountId: string;
  @Output() deleteClick = new EventEmitter<AlarmActionSetting>();

  constructor() {
  }

}
