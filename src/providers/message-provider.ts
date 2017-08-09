import { Message } from '../models/message'
import { Observable } from 'rxjs/Rx'

export abstract class MessageProvider {

  abstract getUnreadMessageCount(groupBy:string) : Observable<{ groupItem: string; count: number; }[]>

  abstract getMessages(page: number, alarmType:string, equipment:string, alarmID:string, pattern:string) : Observable<Message[]> 

  abstract getMessageFromUmd(beforeDT:Date) : Observable<Message[]> //UMD Service provide

  abstract getAllMessage() : Observable<Message[]>

  abstract updateReadCount(id: string, employeeName: string) : Observable<any>
  
  abstract setMessageRead(message:Message[]): Observable<boolean>

  abstract addMessage(message: Message): Observable<Message>

  abstract insertTestMessages()
  
  abstract delete(key: number): Observable<any>

  abstract getMessageNotifier(): Observable<Message>

  abstract archive(message: Message): Observable<any>

  abstract restore(message: Message): Observable<any>

  abstract init(): Observable<any>;
  
  
}

