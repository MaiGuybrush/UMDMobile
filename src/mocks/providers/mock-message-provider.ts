import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { Observable } from 'rxjs/Rx'
import { Api } from '../../providers/api'
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

 constructor(public http: Http) {
  }
  
  getUnreadMessage(alarmType:string, eqptID:string, alarmID:string) : Observable<Message[]>
  {
    return Observable.from([MESSAGES]).map(m => {
      let output:Message[] = [];
      m.forEach(msg => {
        if (msg.read)
        {
          output.push(msg);
        }
      })
      return output;
    });    
  }

  getAllMessage() : Observable<Message[]>
  {
    return Observable.from([MESSAGES]);    
  }

  insertTestMessages(): Observable<Message[]>
  {
    return undefined;

  }

  getMessage(page: number, alarmType:string, equipment:string, alarmID:string) : Observable<Message[]>
  {
    console.log('mockMESSAGES:'+JSON.stringify(MESSAGES));
    return Observable.from([MESSAGES]);
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
    // let found = false;
    // MESSAGES.forEach((m, idx) => {
    //   if (m.id == message.id)
    //   {
    //     MESSAGES[idx] = message;
    //     found = true;
    //   }
    // })
    // if (!found)
    // {
    //   MESSAGES.push(message);
    // }
    return undefined;
  }
  setMessageRead(messages: Message[]): Observable<Message[]>
  {
    messages.forEach(m => {
      m.read = true;
    });
    return Observable.from([messages]);
  }
  // set(key: string, value: string): Promise<any>
  // {
  //     return undefined;
  // }

  // get(key: string): Promise<any> 
  // {
  //     return undefined;
  // }

  delete(key: number): Observable<any>
  {
      return undefined;
  }

  // getall(): Promise<any>
  // {
  //     return undefined;
  // }


  // getItems(ev) {
  //   // Reset items back to all of the items
  //   this.getMessage();

  //   // set val to the value of the ev target
  //   var val = ev.target.value;

  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() != '') {
  //     this.items = this.items.filter((item) => {
  //       return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //   }
  // }
}
