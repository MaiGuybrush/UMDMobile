import { Injectable } from '@angular/core'
import { Platform } from 'ionic-angular'
import { Http } from '@angular/http'
import { Api } from './api'
import { Message } from '../models/message'
import { MessageProvider } from './message-provider'
import { Observable, Observer } from 'rxjs/Rx'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { MESSAGES } from '../mocks/MESSAGES'

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UmdMessageProvider implements MessageProvider {
  storage: any;
  DB_NAME: string = 'umd_Storage_v001';
  items = [];
  message: Message[]=[];
  pageSize = 8;
  private static messageObserver:any; 
  public static messageNotifier: Observable<Message> = Observable.create(observer => {
    UmdMessageProvider.messageObserver = observer;
  });
  constructor(public platform: Platform,public http: Http, public sqlite: SQLite) {

  }

  
  private getDB(): Observable<SQLiteObject>
  {
    if (!this.storage)
    {
      let db = Observable.fromPromise(
        this.sqlite.create({ name: this.DB_NAME, location: 'default' }));
      db.subscribe(m => {
        console.log("db initialized.");
      },
      e => {
        console.log(`db initialized fail. err=[${e}]`);
      });

      let output = db.map(m => {
        this.storage = m;
        return this.tryInit(m);
      }).concatAll();

      output.subscribe(m => {
      }, e => {
        console.log(`table initialized fail! err=[${e}]`)
      })
      return output;
    }
    else
    {
      return Observable.from([this.storage]);
    }
  }

  public insertTestMessages(): Observable<Message[]>
  {
      // let output = Observable.create(observer => {
      // let messages = [];
        return Observable.range(0, MESSAGES.length).map( i =>
          this.addMessage(MESSAGES[i])
        ).concatAll().toArray();
      //   observer.complete();
      // })
  }

  protected tryInit(db: SQLiteObject): Observable<SQLiteObject> {
    return Observable.fromPromise(
        db.executeSql("CREATE TABLE IF NOT EXISTS message (id text, occurDT text, alarmID text,eqptID text " +
                  ", alarmMessage text,alarmType text,description text,read integer)", []))
        .map(m => db);
        // .subscribe(undefined, 
        // err => {
        //     console.error(`Unable to create initial storage message, err="${err}"`);
        // });

  }

  delete(key: number): Observable<any> {
    return this.getDB().map(db => 
      Observable.fromPromise(
        db.executeSql("delete from message where rowid = ?", [key]))
    ).concatAll();
  }
 
   private loadMessage(condition: string, queryPageNo: number): Observable<Message[]>{
    // id text,occurDT text, alarmID text,eqptID text,alarmMessage text,alarmType text,description text,read text
    let limit = queryPageNo > 0 ? ` limit ${(queryPageNo - 1) * this.pageSize}, ${(queryPageNo) * this.pageSize}` : '';
    let output = Observable.create( observer => {
      this.getDB().subscribe(db =>
      {
        Observable.fromPromise(db.executeSql("select rowid, id, occurDT, alarmID, eqptID, alarmMessage, " + 
                    `description,alarmType,read from message ${condition} order by occurDT desc ${limit}`, []))
        .subscribe(res => {
            //   console.log("getallresultSet: "+JSON.stringify(resultSet));
          let messages: Message[] = [];

          if(res.rows.length > 0) {
                    //   this.items = [];
            for(let i = 0; i < res.rows.length; i++) {
                var row = res.rows.item(i);
                let message = new Message();
                message = {
                  id: row.id,
                  rowid: row.rowid,
                  occurDT: new Date(row.occurDT),
                  alarmID: row.alarmID,
                  description: row.description,
                  alarmMessage:row.alarmMessage,                             
                  alarmType: row.alarmType,
                  eqptID: row.eqptID ,   
                  read: row.read == 1              
                }
                messages.push(message);
            }
          }
          observer.next(messages);
        },
        error => {
          observer.error(error)
        },
        () => {observer.complete()}); 
      })
    });    
    return output;
    // let limit = queryPageNo > 0 ? ` limit ${(queryPageNo - 1) * this.pageSize}, ${(queryPageNo) * this.pageSize}` : '';
    //  return this.query(`select rowid, id,occurDT,alarmID ,eqptID,alarmMessage,description,alarmType,read from message ${condition} order by occurDT desc 
    //                     ${limit}` )
    //      .map(resultSet => {
    //         //   console.log("getallresultSet: "+JSON.stringify(resultSet));
    //         if(resultSet.res.rows.length > 0) {
    //                  //   this.items = [];
    //           this.message=[];
    //           for(let i = 0; i < resultSet.res.rows.length; i++) {
    //               var row = resultSet.res.rows.item(i);
    //               this.message.push({
    //                 "id": row.id,
    //                 "rowid": row.rowid,
    //                 "occurDT": new Date(row.occurDT),
    //                 "alarmID": row.alarmID,
    //                 "description": row.description,
    //                 "alarmMessage":row.alarmMessage,                             
    //                 "alarmType": row.alarmType,
    //                 "eqptID": row.eqptID ,   
    //                 "read": row.read ,
                                              
    //               });
    //           }
                        
    //                //      console.log('SqliteMessage:'+JSON.stringify(this.message));
    //           return   this.message;
    //         }
    //         else
    //         {
    //           return [];
    //         }
    //       }) 
  }
  
  composeCondition(alarmType:string, eqptID:string, alarmID:string)
  {
     let condition = " WHERE 1=1 ";
     if (alarmType)
     {
        condition += `AND alarmType = '${alarmType}'`;
     }
     if (eqptID)
     {
        condition += `AND eqptID = '${eqptID}'`;
     }
     if (alarmID)
     {
        condition += `AND alarmID = '${alarmID}'`;
     }
     return condition;
  }

  getAllMessage() : Observable<Message[]>
  {
     return  Observable.fromPromise(this.platform.ready()).map(m => 
             this.loadMessage("", -1)
            ).concatAll();    
  }


  getUnreadMessage(alarmType:string, eqptID:string, alarmID:string) : Observable<Message[]>
  {
    let condition = this.composeCondition(alarmType, eqptID, alarmID);
     return  Observable.fromPromise(this.platform.ready()).map(m => 
             this.loadMessage("WHERE read = 0 and " + condition, -1)
            ).concatAll();    
  }

  getMessage(page: number, alarmType:string, eqptID:string, alarmID:string) : Observable<Message[]>
  {
    let condition = this.composeCondition(alarmType, eqptID, alarmID);
    return  Observable.fromPromise(this.platform.ready()).map(m => 
      this.loadMessage(condition, page)
    ).concatAll();
  }

  getMessageFromUmd(beforeDT:Date) : Observable<Message[]> //UMD Service provide
  {
    //TODO: wait for implements
    return Observable.from([[new Message()]]);
  }
  
  getMessageNotifier(): Observable<Message>
  {
    return UmdMessageProvider.messageNotifier;
  }

  addMessage(message: Message) : Observable<Message>
  {
    var msg = message;
    let output = this.getDB().map(db =>
    {
      console.log("set id, alarmid,message,time="+ message.id + ":"+ message.alarmID + ":"+ message.alarmMessage+":"+message.occurDT);

      return Observable.fromPromise(db.executeSql('insert into message(id,occurDT , alarmID ,eqptID ,alarmMessage ,alarmType ,description ,read ) values (?,?,?,?,?,?,?,?)'
        , [message.id,message.occurDT,message.alarmID,message.eqptID,message.alarmMessage,message.alarmType,message.description,message.read ? 1 : 0]))
      .map( 
        m => {
          msg.rowid = m.insertId;
          return message;
        }
      );
    }).concatAll();
    output.subscribe(m => {
      UmdMessageProvider.messageObserver.next(m);
    })
    return output;
  }

  setMessageRead(messages: Message[]): Observable<Message[]>
  {
    let output = this.getDB()
    .map(db => Observable.fromPromise(
      db.transaction(tx => {
        Observable.range(0, messages.length)
        .subscribe(m => {
          messages[m].read = true;
          console.log(`set message read ${messages[m].rowid}`);
          tx.executeSql('update  message set read = ? where rowid = ?', [1, messages[m].rowid])
        })
      })
    )).concatAll().map(m => messages);
    output.subscribe(m => {
    }, e => {
      console.log(`Error: setMessageRead -- e=[${e}]`);
    })
    return output;
  }
}
