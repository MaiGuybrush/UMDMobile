import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { MessageProvider } from '../../providers/message-provider'
import { Message } from '../../models/message'
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

  getUnreadMessageCount(groupBy:string) : Observable<{ groupItem: string; count: number; }[]>
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
    let output:{ groupItem: string; count: number; }[] = [];
    map.forEach(m => {
      output.push({ groupItem: m.key, count: m.value.length });
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

  getMessage(page: number, alarmType:string, equipment:string, alarmID:string) : Observable<Message[]>
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
  setMessageRead(messages: Message[]): Observable<Message[]>
  {
    messages.forEach(m => {
      m.read = true;
    });
    return Observable.from([messages]);
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

}
