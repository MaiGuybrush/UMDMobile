import { Component, Input, OnInit, OnChanges} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx'
import { MessagesPage } from '../../pages/messages/messages'
import { Message } from '../../models/message';

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
    category: string;
    @Input()
    navCtrl: NavController;
    constructor()
    {
    }

    ngOnInit() {
        
    }

    ngOnChanges()
    {
        this.unreadCount = 0;
        var me = this;
        return Observable.from(this.messages).filter(m => !m.read).subscribe(m => me.unreadCount++)        
    }

    pushPage(): void
    {
        this.navCtrl.push(MessagesPage, {'messages': this.messages})
    }

    getUnreadCount()
    {
        return this.unreadCount;
    }
}