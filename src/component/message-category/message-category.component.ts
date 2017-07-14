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
    @Input()
    unreadCount: number;
    // @Input()
    // messages : Message[] = [];    
    @Input()
    categoryMethod: CategoryMethod;
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