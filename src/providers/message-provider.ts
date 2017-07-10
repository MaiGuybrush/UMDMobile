
import { Message } from '../models/message'
import { Observable } from 'rxjs/Rx'

export abstract class MessageProvider {

  abstract getUnreadMessage(alarmType:string, eqptID:string, alarmID:string) : Observable<Message[]>

  abstract getMessage(page: number, alarmType:string, equipment:string, alarmID:string) : Observable<Message[]> 

  abstract getMessageFromUmd(beforeDT:Date) : Observable<Message[]> //UMD Service provide

  abstract getAllMessage() : Observable<Message[]>

  abstract setMessageRead(message:Message[]): Observable<Message[]>

  abstract addMessage(message: Message): Observable<Message>

  abstract insertTestMessages() : Observable<any>
  
  abstract delete(key: number): Observable<any>

  abstract getMessageNotifier(): Observable<Message>
}

