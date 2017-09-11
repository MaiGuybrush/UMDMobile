import { Injectable } from '@angular/core'
import { Platform } from 'ionic-angular'
import * as moment from 'moment'
import { Http } from '@angular/http'
import { Message } from '../models/message'
import { MessageProvider } from './message-provider'
import { Observable } from 'rxjs/Rx'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CategorizedSummary } from '../models/categorized-summary'
import { MESSAGES } from '../mocks/MESSAGES'
import { Config } from '../models/config';
import { DbProvider} from './db/db'
import { ConfigProvider } from './config-provider';


/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UmdMessageProvider implements MessageProvider {
  sqliteObject: SQLiteObject;
  static dbName: string = "umd_storage_004";
  static schemaVersion: number = 2;
  items = [];
  message: Message[]=[];
  // static pageSize = 8;
  private static messageObserver:any; 

  public static messageNotifier: Observable<Message>
  constructor(public platform: Platform,public http: Http, public db: DbProvider, public configProvider: ConfigProvider) {

  }

  public init(): Observable<any> {
    console.log("start create Table..")
    
    return Observable.fromPromise(this.db.ready()).concatMap(m =>
      this.createTables())
    // console.log("checkVersionAndUpdate db start..")
//    Observable.checkVersionAndUpdate()
  
    // return output.from([true]);
        // .subscribe(undefined, 
        // err => {
        //     console.error(`Unable to create initial storage message, err="${err}"`);
        // });

  }


  // private getDB(): Observable<SQLiteObject>
  // {
  //   if (!this.sqliteObject)
  //   {
  //       return Observable.fromPromise(
  //         this.sqlite.create({ name: UmdMessageProvider.dbName, location: "default" })
  //       )
  //   }
  //   else
  //   {
  //     return Observable.from([this.sqliteObject]);
  //   }
  // }

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
          this.addMessage(MESSAGES[i]).subscribe(
            m => {console.log("add successful")},
            e => {console.log("add failed!" + JSON.stringify(e))}
          )
        }
      //   observer.complete();
      // })
  }

  protected checkVersionAndUpdate()
  {
    let sql = `SELECT version FROM schema_version;`;
    console.log("checkVersionAndUpdate enter")!
    let db = this.db.getDB();
    db.executeSql(sql, []).then(res => { 
      console.log("checkVersionAndUpdate map")!
      let currentVersion = 0;
      if (res.rows.length > 0)
      {
        currentVersion = res.rows.item(0).version;
      }   
      else {
        db.executeSql(`INSERT INTO schema_version (version) VALUES (0)`, []);
      }     
      return this.schemaUpdate(db, currentVersion)
    })
  }

  protected schemaUpdate(db: SQLiteObject, fromVersion:number): Observable<SQLiteObject>
  {
    let output;
    if (fromVersion > 0 && fromVersion < 2)
    {
      console.log("update schema for version 2.")
      output = this.db.getDB().transaction(tx => {
        tx.executeSql(
          `ALTER TABLE message ADD COLUMN uuid text default ''`, []);
        tx.executeSql(
          `ALTER TABLE message ADD COLUMN readcount integer default 0`, []);
        tx.executeSql(
          `ALTER TABLE message ADD COLUMN readnamelist text default ''`, []);
      })
    }
    let updateVersion = db.executeSql(`UPDATE schema_version SET version = ?`, [UmdMessageProvider.schemaVersion])
    output = output ? output.map(m => updateVersion).concatAll() : updateVersion;
    return output;
  }

  
  createTables() : Observable<any>
  {
    return Observable.from(this.db.getDB().transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS message (id text, uuid text, readcount integer, readnamelist text, occurDT text, 
          alarmID text,eqptID text , alarmMessage text,alarmType text,
          description text, read integer default 0, archived integer default 0)`, []);
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS schema_version (version integer)`, []);
      }))
  }

  delete(key: number): Observable<any> {
    return Observable.fromPromise(this.db.getDB().executeSql(`delete from message where rowid = ?`, [key]))
    
  }
 

   private loadMessage(condition: string, queryPageNo: number): Observable<Message[]>{
    let pageSize = this.configProvider.getConfig().pageSize;
    // this.configProvider.loadConfig().subscribe(m =>{UmdMessageProvider.pageSize = m.pageSize});
    // id text,occurDT text, alarmID text,eqptID text,alarmMessage text,alarmType text,description text,read text
    // let limit = queryPageNo > 0 ? ` limit ${(queryPageNo - 1) * pageSize}, ${(queryPageNo) * pageSize}` : ``;
    let limit = queryPageNo > 0 ? ` limit ${(queryPageNo - 1) * pageSize}, ${pageSize}` : ``;
    //  console.log("limit: "+ limit);
    let output = Observable.create( observer => {
        
      this.db.getDB().executeSql(`select rowid, id, uuid, readcount, readnamelist,  datetime(occurDT) as occurDT , alarmID, eqptID, alarmMessage,  
                    description, alarmType, read, archived from message ${condition} order by occurDT desc ${limit}`, []).then(res => {
            // console.log("getallresultSet: "+JSON.stringify(res));
        let messages: Message[] = [];

        // console.log("res.rows.length: "+ res.rows.length);

        if(res.rows.length > 0) {
                  //   this.items = [];
          for(let i = 0; i < res.rows.length; i++) {
              var row = res.rows.item(i);
              let message = new Message();
              message = {
                id: row.id,
                uuid: row.uuid,
                rowid: row.rowid,
                readCount: row.readcount,
                readNameList: row.readnamelist,
                occurDT: row.occurDT,
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

        // console.log("messages.length: "+ messages.length);

        observer.next(messages);
        observer.complete()
      }).catch(e => {
        observer.error(e)
      })
    })
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
        condition += ` AND ( alarmMessage LIKE '%${pattern}%' OR alarmID LIKE '%${pattern}%' ) `;
     }
     return condition;
  }

  getAllMessage() : Observable<Message[]>
  {
     return  Observable.fromPromise(this.platform.ready()).map(m => 
             this.loadMessage("", -1)
            ).concatAll();    
  }

  getUnreadMessageCount(groupBy:string) : Observable<CategorizedSummary[]>
  {
    let sql = `SELECT c.groupItem, u.messageCount from (SELECT DISTINCT ${groupBy} as groupItem from message) as c left join 
    (SELECT ${groupBy} as groupItem, count(*) as messageCount, max(occurDT) as occurDT from message WHERE read = 0 and archived = 0 group by ${groupBy}) as u 
    on c.groupItem == u.groupItem order by u.occurDT desc`;
    return Observable.from(this.db.getDB().executeSql(sql, [])).map(
      res => {
        let output: CategorizedSummary[] = [];
        if(res.rows.length > 0) {
          for(let i = 0; i < res.rows.length; i++) {
            let row = res.rows.item(i);
            output.push({ groupItem: row.groupItem, unreadCount:+ row.messageCount, lastestMessageDT: row.occurDT })
          }  
        }
        return output;
      }
    );    
  }

  updateReadCount(id: string, employeeName: string) : Observable<any>
  {
    var theId = id;
    return Observable.create(server => {
      let sql = `UPDATE message SET readcount = readcount + 1 AND readnamelist = readnamelist || ? || ',' WHERE id = ?`;
      return Observable.fromPromise(this.db.getDB().executeSql(sql, [employeeName, id])).subscribe( m => {
        this.getMessage(theId).subscribe(m => 
          UmdMessageProvider.messageObserver.next(m)
        )
      })
    })                 
  }
  
  getMessage(id: string) : Observable<Message>
  {
    let sql = "SELECT * FROM message WHERE id = ?";
  
    UmdMessageProvider.messageObserver.next();
    return Observable.fromPromise(this.db.getDB().executeSql(sql, [id]))

  }
  
  getMessages(page: number, alarmType:string, eqptID:string, alarmID:string, pattern: string) : Observable<Message[]>
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
    if(!UmdMessageProvider.messageNotifier)
    {
      UmdMessageProvider.messageNotifier = Observable.create(observer => {
        UmdMessageProvider.messageObserver = observer;
      });
     }
    return UmdMessageProvider.messageNotifier;
  }

  addMessage(message: Message) : Observable<Message>
  {
    console.log("set id, alarmid,message,time="+ message.id + ":"+ message.alarmID + ":"+ message.alarmMessage+":"+message.occurDT);

    return Observable.fromPromise(this.db.getDB().executeSql(`insert into message(id, uuid, readcount, occurDT , alarmID ,eqptID ,alarmMessage ,alarmType ,description ,read) values (?,?,?,?,?,?,?,?,?,?)`
      , [message.id, message.uuid, message.readCount, moment(message.occurDT).format("YYYY-MM-DD HH:mm:ss.SSSSSS"), message.alarmID, message.eqptID, message.alarmMessage
      , message.alarmType, message.description, message.read ? 1 : 0]))
    .map( 
      m => {
        message.rowid = m.insertId;
        if(UmdMessageProvider.messageObserver)
        {
          UmdMessageProvider.messageObserver.next(message);
        }
        return message;
      }
    );
  }

  setMessageRead(messages: Message[]): Observable<any>
  {
    let res = Observable.fromPromise(this.db.getDB().transaction(tx => {
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

    return res;
  }

  deleteOverDurationsMessages(duration: number)
  {
    let beforeDate = moment().subtract(duration, 'd');
    return Observable.fromPromise(this.db.getDB().executeSql(`delete from message where occurDT < ?`
      , [beforeDate.format("YYYY-MM-DD HH:mm:ss.000000")]))
  }

  archive(message: Message): Observable<any>  
  {
    return Observable.fromPromise(this.db.getDB().executeSql(`update message set archived = ? where rowid = ?`, [1, message.rowid]))
    
  }

  restore(message: Message): Observable<any>
  {
    return Observable.fromPromise(this.db.getDB().executeSql(`update message set archived = ? where rowid = ?`, [0, message.rowid]))
  }  
}
