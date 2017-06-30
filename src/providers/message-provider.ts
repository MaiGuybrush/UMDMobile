
import { Message } from '../models/message'
import { Observable } from 'rxjs/Rx'

export abstract class MessageProvider {

  abstract getUnreadMessage() : Observable<Message[]>

  abstract getMessage(page: number, alarmType:string, equipment:string, alarmID:string) : Observable<Message[]> 

  abstract getMessageFromUmd(beforeDT:Date) : Observable<Message[]> //UMD Service provide

  abstract setMessageRead(message:Message[])

  abstract saveMessage(message: Message)

  abstract remove(key: string): Promise<any>
}

