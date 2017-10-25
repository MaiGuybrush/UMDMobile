import { RegistrationEventResponse } from '@ionic-native/push';
import { PushProvider } from '../../providers/push-provider'
import { Message } from '../../models/message'
import { Observable } from 'rxjs/Rx'

export class MockPushProvider implements PushProvider {
    pushReadNotification(message: Message, name: string) : Observable<boolean>
    {
            return Observable.from([true]);
    }
    pushInit(): Observable<RegistrationEventResponse & Error>
    {
        return ;
    }
    hasPermission(): Observable<boolean>
    {
        return;
    }
    pushNotificationHandler(data: any) {
    }
    increaseBadgeCount(count: number): Observable<any>
    {
        return Observable.from([true]);
    }
    setBadgeCount(count: number): Observable<any>    
    {
        return Observable.from([true]);
        
    }
    
}