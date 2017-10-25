import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Message } from '../../models/message';
import * as moment from 'moment'

@Component({
    selector: 'message-detail',
    templateUrl: './message-detail.component.html'
})
export class MessageDetailComponent
{
    @Input()
    msg: Message;
    occurDT : Date;
    @Output()
    swipeEvent: EventEmitter<Event> = new EventEmitter();

    constructor()
    {
    }

    ngOnInit() {
        this.occurDT = moment.utc(this.msg.occurDT).toDate();
    }

    swipeHandler(event)
    {
        this.swipeEvent.emit(event);
    }
}