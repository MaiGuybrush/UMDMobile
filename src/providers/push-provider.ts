import { RegistrationEventResponse } from '@ionic-native/push';
import { Message } from '../models/message'
import { Observable } from 'rxjs/Rx'

export abstract class PushProvider  {
    abstract pushReadNotification(message: Message, name: string) : Observable<boolean>
    abstract pushInit(): Observable<RegistrationEventResponse & Error>
}