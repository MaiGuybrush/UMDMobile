import { Component, Input, OnInit, EventEmitter, Output} from '@angular/core';

export enum CategoryMethod
{
  ByAlarmID,
  ByEquipment,
  ByAlarmType
}


@Component({
    selector: 'message-category',
    templateUrl: './message-category.component.html'
})
export class MessageCategoryComponent implements OnInit
{
    @Input()
    unreadCount: number;
    // @Input()
    // messages : Message[] = [];    
    @Input()
    categoryMethod: CategoryMethod;
    @Input()
    category: string;
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
        this.itemClicked.emit({categoryMethod: this.categoryMethod, categoryValue: this.category});
    }

    getUnreadCount()
    {
        return this.unreadCount;
    }
}