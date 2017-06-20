import { Injectable } from '@angular/core'
import { Platform } from 'ionic-angular'
import { Http } from '@angular/http'
import { Api } from './api'
import { Message } from '../models/message'
import { MessageProvider } from './message-provider'
import { Observable } from 'rxjs/Rx'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UmdMessageProvider implements MessageProvider {
      storage: any;
     DB_NAME: string = 'umd_Sorage';
     items = [];
     message:Message[]=[];

  constructor(public platform: Platform,public http: Http, public sqlite: SQLite) {
      sqlite.create({ name: this.DB_NAME, location: 'default' })
          .then((db: SQLiteObject) => {
              this.storage = db; 
              this.tryInit();
      });
  }
  protected tryInit() {
        this.query('CREATE TABLE IF NOT EXISTS message (id text,occurDT text, alarmID text,eqptID text,alarmMessage text,alarmType text,description text,read text ,PRIMARY KEY(id))')
        .catch(err => {
            console.error('Unable to create initial storage message', err.tx, err.err);
        });
    }
     /**
     * Perform an arbitrary SQL operation on the database. Use this method
     * to have full control over the underlying database through SQL operations
     * like SELECT, INSERT, and UPDATE.
     *
     * @param {string} query the query to run
     * @param {array} params the additional params to use for query placeholders
     * @return {Promise} that resolves or rejects with an object of the form 
     * { tx: Transaction, res: Result (or err)}
     */
  query(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
       
           this.storage.transaction((tx: any) => {
              tx.executeSql(query, params,
                (tx: any, res: any) => resolve({tx: tx, res: res}),
                (tx: any, err: any) => reject({tx: tx, err: err}));
            },
            (err: any) => reject({err: err}));
     
      } catch (err) {
        reject({err: err});
      }
    });
  }


 
  remove(key: string): Promise<any> {
        return this.query('delete from message where alarmID like ?', [key]);
         //return this.query('delete from kv where key = ?', [key]);
    }
 
   getAllMessage(): Promise<Message[]>{
    // id text,occurDT text, alarmID text,eqptID text,alarmMessage text,alarmType text,description text,read text
     return this.query('select id,occurDT,alarmID ,eqptID,alarmMessage,description,alarmType from message order by occurDT asc  ')
         .then(resultSet => {
            //   console.log("getallresultSet: "+JSON.stringify(resultSet));
              if(resultSet.res.rows.length > 0) {
                     //   this.items = [];
                       this.message=[];
                        for(let i = 0; i < resultSet.res.rows.length; i++) {
                           var row = resultSet.res.rows.item(i);
                            this.message.push({
                              "id": row.id,
                              "occurDT": new Date(row.occurDT),
                              "alarmID": row.alarmID,
                              "description": row.description,
                              "alarmMessage":row.alarmMessage,                             
                              "alarmType": row.alarmType,
                              "eqptID": row.eqptID ,   
                              "read": row.read ,
                                                        
                            });
                        }
                        
                   //      console.log('SqliteMessage:'+JSON.stringify(this.message));
                         return   this.message;
                    }
          }) 
        }
  
  
 getMessage() : Observable<Message[]>
  {
     return  Observable.fromPromise(this.platform.ready()).map(m => 
             Observable.fromPromise(this.getAllMessage())
            ).concatAll();
  }

  getMessageFromUmd(beforeDT:Date) : Observable<Message[]> //UMD Service provide
  {
    //TODO: wait for implements
    return Observable.from([[new Message()]]);
  }

  saveMessage(message: Message)
  {
        console.log("set id, alarmid,message,time="+ message.id + ":"+ message.alarmID + ":"+ message.alarmMessage+":"+message.occurDT);
        return this.query('insert into message(id,occurDT , alarmID ,eqptID ,alarmMessage ,alarmType ,description ,read ) values (?,?,?,?,?,?,?,?)', [message.id,message.occurDT,message.alarmID,message.eqptID,message.alarmMessage,message.alarmType,message.description,message.read]);
    
  }
}
