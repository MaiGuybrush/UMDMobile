import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Message } from '../../models/message';

@Component({
    selector: 'message-detail',
    templateUrl: './message-detail.component.html'
})
export class MessageDetailComponent
{
    @Input()
    msg: Message;
    @Output()
    swipeEvent: EventEmitter<Event> = new EventEmitter();

    constructor()
    {
    }

    ngOnInit() {

    }

    ngOnChanges()
    {

    }

    swipeHandler(event)
    {
        this.swipeEvent.emit(event);
    }
}