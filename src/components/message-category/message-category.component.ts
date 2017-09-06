import { Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import { CategorizedSummary } from '../../models/categorized-summary'

export enum CategoryMethod
{
  AlarmID,
  Equipment,
  AlarmType
}


@Component({
    selector: 'message-category',
    templateUrl: 'message-category.component.html'
})
export class MessageCategoryComponent implements OnInit
{
    @Input() public categorizedSummary: CategorizedSummary;
    @Input() public categoryMethod: CategoryMethod;
    @Output()
    itemClicked = new EventEmitter();
    constructor()
    {
    }

    ngOnInit() {

    }



    ngOnChanges()
    {
        // Observable.from(this.messages).count(
        //   m => !m.read
        // ).subscribe(
        //   m => this.unreadCount = m
        // );
    }

    clickedHandler()
    {
        this.itemClicked.emit({categoryMethod: this.categoryMethod, categoryValue: this.categorizedSummary.groupItem});
    }

}