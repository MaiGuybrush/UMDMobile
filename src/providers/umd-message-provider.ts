import { Injectable } from '@angular/core'
import { Platform } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';
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
  sqliteObject: SQLiteObject;
  static dbName: string = 'umd_storage_004';
  static dbVersion: number = 1;
  items = [];
  message: Message[]=[];
  pageSize = 8;
  private static messageObserver:any; 

  public static messageNotifier: Observable<Message> = Observable.create(observer => {
    UmdMessageProvider.messageObserver = observer;
  });
  constructor(public platform: Platform,public http: Http, public sqlite: SQLite
              , public loading: LoadingController) {

  }

  public init(): Observable<any> {
      let db = Observable.fromPromise(this.platform.ready()).map(m => 
      {
        Observable.fromPromise(
          this.sqlite.deleteDatabase({ name: "umd_Storage_v001", location: 'default' })
        )
        Observable.fromPromise(
          this.sqlite.deleteDatabase({ name: "umd_Storage_002", location: 'default' })
        )
        Observable.fromPromise(
          this.sqlite.deleteDatabase({ name: "umd_Storage_003", location: 'default' })
        )
        return Observable.fromPromise(
          this.sqlite.create({ name: UmdMessageProvider.dbName, location: 'default' })
        )
      }).concatAll();
      db.subscribe(m => {
        console.log("db initialized.");
      },
      e => {
        console.log(`db initialized fail. err=[${e}]`);
      });
    
    return db.map( db => {
      let output = this.createTables(db);
      this.sqliteObject = db;
      output.subscribe(m => {
      }, e => {
        console.log(`table initialized fail! err=[${e}]`)
      })
      return output;
    }).concatAll();
        // .subscribe(undefined, 
        // err => {
        //     console.error(`Unable to create initial storage message, err="${err}"`);
        // });

  }


  private getDB(): Observable<SQLiteObject>
  {
    if (!this.sqliteObject)
    {
        return Observable.fromPromise(
          this.sqlite.create({ name: UmdMessageProvider.dbName, location: 'default' })
        )
    }
    else
    {
      return Observable.from([this.sqliteObject]);
    }
  }

  private isColumnExist(table:string, column:string, db: SQLiteObject): Observable<boolean>
  {
    return Observable.fromPromise(db.executeSql("PRAGMA table_info("+ table +")",[])).map(
        res => {
          if(res.rows.length > 0) {
            for(let i = 0; i < res.rows.length; i++) {
              if (res.rows.item(i).name == column)
              {
                return true;
              }
            }
          }
          return false;
        }
      );
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

  protected checkVersionAndUpdate(db: SQLiteObject): Observable<SQLiteObject>
  {
    let sql = "SELECT version FROM schema_version;";
    return Observable.from(db.executeSql(sql, [])).map(res =>
      { 
        if (res.rows.length > 0)
        {
          let currentVersion = res.rows.item(0).version;
          return this.schemaUpdate(db, currentVersion)
        }
        else
        {
          return Observable.from(db.executeSql(`INSERT INTO schema_version values (?);`, [0]))
          .map(m => this.schemaUpdate(db, 0)).concatAll();          
        }          
      }
    ).concatAll();
  }

  protected schemaUpdate(db: SQLiteObject, fromVersion:number): Observable<SQLiteObject>
  {
    let output;
    if (!fromVersion)
    {
      fromVersion = 0
    }
    if (fromVersion < 1)
    {
      let sql = "ALTER TABLE message ADD COLUMN IF NOT EXIST archived integer default 0";
      let stepOutput = Observable.fromPromise(db.executeSql(sql, [])).map(m => db);
      stepOutput.subscribe( e => {
        console.error(`Unable to create initial storage message, err=${e}, sql=${sql}`);
      });
      output = output ? output.map(m => stepOutput) : stepOutput;
    }
    let updateVersion = db.executeSql('UPDATE schema_version SET version = ?', [UmdMessageProvider.dbVersion])
    output = output ? output.map(m => updateVersion).concatAll() : updateVersion;
    // if (!output)
    // {
    //   return Observable.create(observer => {
    //     observer.next(db);
    //     observer.complete();
    //   })
    // }
    return output;
  }

  
  createTables(db: SQLiteObject): Observable<SQLiteObject>
  {
    return Observable.fromPromise(
      db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS message (id text, occurDT text, 
          alarmID text,eqptID text , alarmMessage text,alarmType text,
          description text, read integer default 0, archived integer default 0)`, []);
        let res = tx.executeSql(
          `CREATE TABLE IF NOT EXISTS schema_version (version integer)`, []);
      })
      ).map( m =>
        this.checkVersionAndUpdate(db)
      ).concatAll();
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
  
  composeCondition(alarmType:string, eqptID:string, alarmID:string, archived?:boolean)
  {
     let condition = " WHERE 1=1 AND archived = " + (archived ? 1 : 0).toString();
     if (alarmType)
     {
        condition += ` AND alarmType = '${alarmType}'`;
     }
     if (eqptID)
     {
        condition += ` AND eqptID = '${eqptID}'`;
     }
     if (alarmID)
     {
        condition += ` AND alarmID = '${alarmID}'`;
     }
     return condition;
  }

  getAllMessage() : Observable<Message[]>
  {
     return  Observable.fromPromise(this.platform.ready()).map(m => 
             this.loadMessage("", -1)
            ).concatAll();    
  }

  getUnreadMessageCount(groupBy:string) : Observable<[{ groupItem: string; count: number; }]>
  {
    let sql = `SELECT c.groupItem, u.messageCount from (SELECT DISTINCT ${groupBy} as groupItem from message) as c left join 
    (SELECT ${groupBy} as groupItem, count(*) as messageCount from message WHERE read = 0 group by ${groupBy}) as u 
    on c.groupItem == u.groupItem order by u.messageCount, c.groupItem`;
     return this.getDB().map(m => 
      Observable.fromPromise(m.executeSql(sql, [])).map(
        res => {
          let output: { groupItem: string; count: number; }[] = [];
          if(res.rows.length > 0) {
            for(let i = 0; i < res.rows.length; i++) {
              let row = res.rows.item(i);
              output.push({ groupItem: row.groupItem, count:+ row.messageCount })
            }  
          }
          return output;
        }
      )
    ).concatAll();    
  }

  getMessage(page: number, alarmType:string, eqptID:string, alarmID:string) : Observable<Message[]>
  {
    let condition = this.composeCondition(alarmType, eqptID, alarmID);
    return this.loadMessage(condition, page);
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

      return Observable.fromPromise(db.executeSql('insert into message(id,occurDT , alarmID ,eqptID ,alarmMessage ,alarmType ,description ,read) values (?,?,?,?,?,?,?,?)'
        , [message.id,message.occurDT,message.alarmID,message.eqptID,message.alarmMessage
          ,message.alarmType,message.description,message.read ? 1 : 0]))
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

  archive(message: Message): Observable<any>  
  {
    return this.getDB().map(m => 
      Observable.fromPromise(m.executeSql("update message set archived = ? where rowid = ?", [1, message.rowid]))
    ).concatAll();
  }

  restore(message: Message): Observable<any>
  {
    return this.getDB().map(m => 
      Observable.fromPromise(m.executeSql("update message set archived = ? where rowid = ?", [0, message.rowid]))
    ).concatAll();    
  }  
}
