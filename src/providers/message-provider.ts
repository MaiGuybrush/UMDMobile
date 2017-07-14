
import { Message } from '../models/message'
import { Observable } from 'rxjs/Rx'

export abstract class MessageProvider {

  abstract getUnreadMessageCount(groupBy:string) : Observable<{ groupItem: string; count: number; }[]>

  abstract getMessage(page: number, alarmType:string, equipment:string, alarmID:string) : Observable<Message[]> 

  abstract getMessageFromUmd(beforeDT:Date) : Observable<Message[]> //UMD Service provide

  abstract getAllMessage() : Observable<Message[]>

  abstract setMessageRead(message:Message[]): Observable<Message[]>

  abstract addMessage(message: Message): Observable<Message>

  abstract insertTestMessages() : Observable<any>
  
  abstract delete(key: number): Observable<any>

  abstract getMessageNotifier(): Observable<Message>

  abstract archive(message: Message): Observable<any>

  abstract restore(message: Message): Observable<any>

  abstract init(): Observable<any>;
}

