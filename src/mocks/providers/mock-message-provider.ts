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
  getAllMessage(): Promise<any>{
    return;
  }
  
  getMessage() : Observable<Message[]>
  {
    console.log('mockMESSAGES:'+JSON.stringify(MESSAGES));
    return Observable.from([MESSAGES]);
  }

  getMessageFromUmd(beforeDT:Date) : Observable<Message[]> //UMD Service provide
  {
    return Observable.from([MESSAGES]);
  }

  saveMessage(message: Message)
  {

  }

  // set(key: string, value: string): Promise<any>
  // {
  //     return undefined;
  // }

  // get(key: string): Promise<any> 
  // {
  //     return undefined;
  // }

  remove(key: string): Promise<any>
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
