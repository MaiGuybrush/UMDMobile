
import { Message } from '../models/message'
import { Observable } from 'rxjs/Rx'

export abstract class MessageProvider {
 abstract getAllMessage(): Promise<any>

  abstract getMessage() : Observable<Message[]>

  abstract getMessageFromUmd(beforeDT:Date) : Observable<Message[]> //UMD Service provide

  abstract saveMessage(message: Message)

  // abstract set(key: string, value: string): Promise<any>

  // abstract get(key: string): Promise<any> 

  abstract remove(key: string): Promise<any>

  // abstract getall(): Promise<any>
}

