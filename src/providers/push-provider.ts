import { RegistrationEventResponse } from '@ionic-native/push';
import { Message } from '../models/message'
import { Observable } from 'rxjs/Rx'

export abstract class PushProvider  {
    abstract pushReadNotification(message: Message, name: string) : Observable<boolean>
    abstract pushInit()
    abstract hasPermission(): Observable<boolean>
    abstract pushNotificationHandler(data: any)
    abstract increaseBadgeCount(count: number): Observable<any>
    abstract setBadgeCount(count: number): Observable<any>    
}