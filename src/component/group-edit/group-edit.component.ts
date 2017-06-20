import { Component, Input, Output, EventEmitter } from '@angular/core'
import { Group } from '../../models/group'

@Component({
    selector: 'group-edit',
    templateUrl: './group-edit.component.html'
})
export class GroupEditComponent
{

    @Input()
    group: Group;  
    @Output() editClick = new EventEmitter<Group>();
    @Output() deleteClick = new EventEmitter<Group>();
    constructor()
    {


    }
}