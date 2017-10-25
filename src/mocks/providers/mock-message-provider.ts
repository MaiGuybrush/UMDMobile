import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { MessageProvider } from '../../providers/message-provider'
import { Message } from '../../models/message'
import { CategorizedSummary } from '../../models/categorized-summary'
import { MESSAGES } from '../MESSAGES'

import 'rxjs/add/operator/map';

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MockMessageProvider implements MessageProvider {
  pageSize = 8;
  
  constructor() {
  }

  loadKeptPush()
  {
     return;
  }

  getDbName() : string
  {
    return "";
  }
  

  getUnreadMessageCount(groupBy:string) : Observable<CategorizedSummary[]>
  {
    const groupedObj = MESSAGES.filter(m => !m.archived && !m.read).reduce((prev, cur)=> {
      if(!prev[cur[groupBy]]) {
        prev[cur[groupBy]] = [cur];
      } else {
        prev[cur[groupBy]].push(cur);
      }
      return prev;
    }, {});
    let map = Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
    let output: CategorizedSummary[] = [];
    map.forEach(m => {
      output.push({ groupItem: m.key, unreadCount: m.value.length, lastestMessageDT: Math.max.apply(m.value.map(msg => msg.occurDT))});
    })
    return Observable.from([output]);
  }

  getAllMessage() : Observable<Message[]>
  {
    return Observable.from([MESSAGES]);    
  }

  insertTestMessages()
  {
      
  }

  getMessages(page: number, alarmType:string, equipment:string, alarmID:string) : Observable<Message[]>
  {
    let output = MESSAGES.slice((page - 1) * this.pageSize, page * this.pageSize)
    return Observable.from(
      [output.filter(m => {
      if (m.archived) {
        return false;
      }
      if (alarmType && alarmType != m.alarmType) {
        return false;
      }
      if (equipment && equipment != m.eqptID) {
        return false;
      }
      if (alarmID && alarmID != m.alarmID) {
        return false;
      }
      return true;
    })]);
  }

  getMessageFromUmd(beforeDT:Date) : Observable<Message[]> //UMD Service provide
  {
    return Observable.from([MESSAGES]);
  }
  getMessageNotifier(): Observable<Message>
  {
    return Observable.create(observer => {})
  }
  addMessage(message: Message): Observable<Message>
  {
    return undefined;
  }

  updateReadCount(id: string, employeeName: string) : Observable<any>
  {
    for (let i = 0; i < MESSAGES.length; i++)
    {
      if (MESSAGES[i].id == id)
      {
        let message = MESSAGES[i];
        message.readCount++;
        message.readNameList = message.readNameList + employeeName;
        break;
      }
    }
    
    return Observable.from([true]);
    
  }
  
  updateMessageRead(messages: Message[]): Observable<any>
  {
    messages.forEach(m => {
      m.read = true;
    });
    return Observable.from([true]);
  }

  updateMessageArchive(messages: Message[]): Observable<any>
  {
    messages.forEach(m => {
      m.archived = true;
    });
    return Observable.from([true]);
  }

  delete(key: number): Observable<any>
  {
      return undefined;
  }

  archive(message: Message): Observable<any>
  {
    for (let i = 0; i < MESSAGES.length; i++)
    {
      if (MESSAGES[i].rowid == message.rowid)
      {
        MESSAGES[i].archived = true;
        break;
      }
    }
    return Observable.from([{}]);
  }

  restore(message: Message): Observable<any>
  {
    for (let i = 0; i < MESSAGES.length; i++)
    {
      if (MESSAGES[i].rowid == message.rowid)
      {
        MESSAGES[i].archived = false;
        break;
      }
    }
    return Observable.from([{}]);
  }
  init(): Observable<any>
  {
    return Observable.from([]);
  }

  deleteOverDurationsMessages(duration: number)
  {

  }

  setAllMessagesRead(alarmType:string, eqptID:string, alarmID:string) : Observable<any>
  {
    return Observable.from([true]);
  }  
}
