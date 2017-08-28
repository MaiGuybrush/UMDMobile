import { Component, Input} from '@angular/core';
import { Department } from '../../models/department';

/**
 * Generated class for the DepartmentComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'department',
  templateUrl: './department.component.html'
})
export class DepartmentComponent 
{
    @Input()
    checked: Boolean = false;
    @Input()
    department: Department;
    constructor()
    {
    }
}
