import { Message } from '../models/message'
import { CategorizedSummary } from '../models/categorized-summary'
import { Observable } from 'rxjs/Rx'

export abstract class MessageProvider {

  abstract getUnreadMessageCount(groupBy:string) : Observable<CategorizedSummary[]>

  abstract getMessages(page: number, alarmType:string, equipment:string, alarmID:string, pattern:string) : Observable<Message[]> 

  abstract getMessageFromUmd(beforeDT:Date) : Observable<Message[]> //UMD Service provide

  abstract getAllMessage() : Observable<Message[]>

  abstract updateReadCount(id: string, employeeName: string) : Observable<any>
  
  abstract updateMessageRead(message:Message[]): Observable<boolean>

  abstract updateMessageArchive(message:Message[]): Observable<boolean>
  
  abstract addMessage(message: Message): Observable<Message>

  abstract insertTestMessages()

  abstract getDbName() : string

  abstract loadKeptPush()
  
  abstract delete(key: number): Observable<any>

  abstract getMessageNotifier(): Observable<Message>

  abstract archive(message: Message): Observable<any>

  abstract restore(message: Message): Observable<any>

  abstract init(): Observable<any>;
  
  abstract deleteOverDurationsMessages(duration: number)

  abstract setAllMessagesRead(alarmType:string, eqptID:string, alarmID:string) : Observable<any>
}

