import { Component, Input, OnInit, OnChanges, EventEmitter, Output} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx'
import { MessagesPage } from '../../pages/messages/messages'
import { Message } from '../../models/message';

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
    unreadCount: number;
    @Input()
    messages : Message[] = [];    
    @Input()
    categoryType: CategoryMethod;
    @Input()
    category: string;
    @Input()
    navCtrl: NavController;
    @Output()
    itemClicked = new EventEmitter();
    constructor()
    {
    }

    ngOnInit() {
        
    }

    ngOnChanges()
    {
        this.unreadCount = 0;
        var me = this;
//        return Observable.from(this.messages).filter(m => !m.read).subscribe(m => me.unreadCount++)        
        return Observable.from(this.messages).filter(m => !m.read).subscribe(m => me.unreadCount++)        
    }

    clickedHandler()
    {
        this.itemClicked.emit({categoryType: this.categoryType, categoryValue: this.category});
    }

    getUnreadCount()
    {
        return this.unreadCount;
    }
}