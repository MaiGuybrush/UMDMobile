import { Injectable } from '@angular/core'
import { Platform } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http'
import { Message } from '../models/message'
import { MessageProvider } from './message-provider'
import { Observable } from 'rxjs/Rx'
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
  static dbName: string = "umd_storage_004";
  static schemaVersion: number = 1;
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
      let db = Observable.fromPromise(this.platform.ready()).concatMap(m => 
      {
        console.log("start create DB..")
        // Observable.fromPromise(
        //   this.sqlite.deleteDatabase({ name: "umd_Storage_v001", location: 'default' })
        // )
        // Observable.fromPromise(
        //   this.sqlite.deleteDatabase({ name: "umd_Storage_002", location: 'default' })
        // )
        // Observable.fromPromise(
        //   this.sqlite.deleteDatabase({ name: "umd_Storage_003", location: 'default' })
        // )
        return Observable.fromPromise(
          this.sqlite.create({ name: UmdMessageProvider.dbName, location: "default" })
        )
      });
      return db.concatMap( db => {
      console.log("start create Table..")
      let output = this.createTables(db);
      this.sqliteObject = db;
      return output;
    });
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
          this.sqlite.create({ name: UmdMessageProvider.dbName, location: "default" })
        )
    }
    else
    {
      return Observable.from([this.sqliteObject]);
    }
  }

  // private isColumnExist(table:string, column:string, db: SQLiteObject): Observable<boolean>
  // {
  //   return Observable.fromPromise(db.executeSql("PRAGMA table_info("+ table +")",[])).map(
  //       res => {
  //         if(res.rows.length > 0) {
  //           for(let i = 0; i < res.rows.length; i++) {
  //             if (res.rows.item(i).name == column)
  //             {
  //               return true;
  //             }
  //           }
  //         }
  //         return false;
  //       }
  //     );
  // }

  public insertTestMessages()
  {
      // let output = Observable.create(observer => {
      // let messages = [];
        for (let i = 0; i < MESSAGES.length; i++)
        {
          this.addMessage(MESSAGES[i])
        }
      //   observer.complete();
      // })
  }

  protected checkVersionAndUpdate(db: SQLiteObject): Observable<SQLiteObject>
  {
    let sql = `SELECT version FROM schema_version;`;
    console.log("checkVersionAndUpdate enter")!

    return Observable.from(db.executeSql(sql, [])).concatMap(res =>
      { 
        console.log("checkVersionAndUpdate map")!
        if (res.rows.length > 0)
        {
          let currentVersion = res.rows.item(0).version;
          return this.schemaUpdate(db, currentVersion)
        }   
        else {
          db.executeSql(`INSERT INTO schema_version (version) VALUES (1)`, []);
          return this.schemaUpdate(db, 1)
        }     
      }
    );
  }

  protected schemaUpdate(db: SQLiteObject, fromVersion:number): Observable<SQLiteObject>
  {
    let output;
    if (!fromVersion)
    {
      fromVersion = 0
    }
    // if (fromVersion < 1)
    // {
    //   let sql = "ALTER TABLE message ADD COLUMN archived integer default 0";
    //   let stepOutput = Observable.fromPromise(db.executeSql(sql, [])).map(m => db);
    //   output = output ? output.map(m => stepOutput) : stepOutput;
    // }
    let updateVersion = db.executeSql(`UPDATE schema_version SET version = ?`, [UmdMessageProvider.schemaVersion])
    output = output ? output.map(m => updateVersion).concatAll() : updateVersion;
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
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS schema_version (version integer)`, []);
      })
    ).concatMap( m => {
        console.log("checkVersionAndUpdate db start..")
        return this.checkVersionAndUpdate(db)
      }
    );
  }

  delete(key: number): Observable<any> {
    return this.getDB().concatMap(db => 
      Observable.fromPromise(
        db.executeSql(`delete from message where rowid = ?`, [key]))
    );
  }
 

   private loadMessage(condition: string, queryPageNo: number): Observable<Message[]>{
    // id text,occurDT text, alarmID text,eqptID text,alarmMessage text,alarmType text,description text,read text
    let limit = queryPageNo > 0 ? ` limit ${(queryPageNo - 1) * this.pageSize}, ${(queryPageNo) * this.pageSize}` : ``;
    //  console.log("limit: "+ limit);
    let output = Observable.create( observer => {
      this.getDB().subscribe(db =>
      {
        Observable.fromPromise(db.executeSql(`select rowid, id, occurDT, alarmID, eqptID, alarmMessage,  
                    description,alarmType,read,archived from message ${condition} order by occurDT desc ${limit}`, []))
        .subscribe(res => {
              // console.log("getallresultSet: "+JSON.stringify(res));
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
                  read: row.read == 1,
                  archived: row.archived
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
  
  composeCondition(alarmType:string, eqptID:string, alarmID:string, pattern:string, archived?:boolean)
  {
     let condition = ` WHERE 1=1 AND archived = ` + (archived ? 1 : 0).toString();
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
     if (pattern)
     {
        condition += ` AND ( alarmMessage LIKE '%${pattern}%' OR description LIKE '%${pattern}%' ) `;
     }
     return condition;
  }

  getAllMessage() : Observable<Message[]>
  {
     return  Observable.fromPromise(this.platform.ready()).map(m => 
             this.loadMessage("", -1)
            ).concatAll();    
  }

  getUnreadMessageCount(groupBy:string) : Observable<{ groupItem: string; count: number; }[]>
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

  getMessage(page: number, alarmType:string, eqptID:string, alarmID:string, pattern: string) : Observable<Message[]>
  {
    let condition = this.composeCondition(alarmType, eqptID, alarmID, pattern, false);
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

      return Observable.fromPromise(db.executeSql(`insert into message(id,occurDT , alarmID ,eqptID ,alarmMessage ,alarmType ,description ,read) values (?,?,?,?,?,?,?,?)`
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

  setMessageRead(messages: Message[]): Observable<any>
  {
    let res = this.getDB().concatMap(db => 
      Observable.fromPromise(
        db.transaction(tx => {
          for (let i = 0; i < messages.length; i++)
          {
            if(!messages[i].read)
            {
              console.log(`set message read ${messages[i].rowid}`);
              tx.executeSql(`update  message set read = ? where rowid = ?`, [1, messages[i].rowid])
            }
          }
        })
      )
    )
    return res;
  }

  archive(message: Message): Observable<any>  
  {
    return this.getDB().concatMap(m => 
      Observable.fromPromise(m.executeSql(`update message set archived = ? where rowid = ?`, [1, message.rowid]))
    );
  }

  restore(message: Message): Observable<any>
  {
    return this.getDB().concatMap(m => 
      Observable.fromPromise(m.executeSql(`update message set archived = ? where rowid = ?`, [0, message.rowid]))
    );    
  }  
}
