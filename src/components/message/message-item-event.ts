import { MessageComponent } from './message.component'
import { Message } from '../../models/message';

export class MessageItemEvent
{    
    public source: MessageComponent;
    public message: Message;
    public check: boolean;
}