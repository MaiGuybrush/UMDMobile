import { Component, Input} from '@angular/core';
import { Employee } from '../../models/employee';

@Component({
    selector: 'employee',
    templateUrl: './employee.component.html'
})
export class EmployeeComponent
{
    @Input()
    checked: Boolean = false;
    @Input()
    employee: Employee;
    constructor()
    {
    }

}