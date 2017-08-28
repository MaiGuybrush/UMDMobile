import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
// import { LoadingController } from 'ionic-angular';
// import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
// import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Config } from '../models/config';
import { ConfigProvider } from './config-provider';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UmdConfigProvider implements ConfigProvider {
  // sqliteObject: SQLiteObject;
  // dbName: string = "umd_storage_004";
  static config: Config ;
  constructor(public platform: Platform, public storage: Storage) {

  }

  // public init(config: Config): Observable<any> {
  //     let db = Observable.fromPromise(this.platform.ready()).concatMap(m => 
  //     {
  //       return Observable.fromPromise(
  //         this.sqlite.create({ name: this.dbName, location: "default" })
  //       )
  //     });
      
  //     return db.concatMap( db => {
  //     let output = this.createTables(db, config);
  //     this.sqliteObject = db;
  //     return output;
  //     });
  // }

  // private getDB(): Observable<SQLiteObject>
  // {
  //   if (!this.sqliteObject)
  //   {
  //       return Observable.fromPromise(
  //         this.sqlite.create({ name: this.dbName, location: "default" })
  //       )
  //   }
  //   else
  //   {
  //     return Observable.from([this.sqliteObject]);
  //   }
  // }
  
  // private createTables(db: SQLiteObject, config: Config): Observable<SQLiteObject>
  // {
  //   console.log("start create Table..")
  //   let output;
  //   let createSql =  `CREATE TABLE IF NOT EXISTS config (soundSwitch integer default 0, soundName text, pageSize integer default 0)`;
  //   let insertSql =  `INSERT INTO config (soundSwitch, soundName, pageSize) VALUES ( ${config.soundSwitch}, '${config.soundName}', ${config.pageSize} )`;
  //   return Observable.fromPromise(
  //     db.transaction(tx => {
  //       tx.executeSql(createSql, []);
  //          console.log("CREATE Config table start..");
  //     })
  //   ).concatMap( m => {
  //       console.log("Insert Config table start..");
  //       let insertConfig = db.executeSql(insertSql, '');
  //       output = output ? output.map(m => insertConfig).concatAll() : insertConfig;
  //       return output;
  //     }
  //   );
  // }

  // public getConfig() : Observable<Config>
  // {
  //   let sql = `select soundSwitch,soundName,pageSize from config`;
  //   return this.getDB().map(m => 
  //     Observable.fromPromise(m.executeSql(sql, [])).map(
  //       res => {
  //          console.log("getConfig: "+JSON.stringify(res.rows.item(0)));
  //         let output: Config ;
  //         if(res.rows.length > 0) {
  //           let row = res.rows.item(0);
  //             output = {soundSwitch: row.soundSwitch, soundName: row.soundName, pageSize: row.pageSize };
  //         }
  //         return output;
  //       }
  //     )
  //   ).concatAll();
  // }


  // public updateConfig(config: Config): Observable<any>
  // {
  //   let res = this.getDB().concatMap(db => 
  //     Observable.fromPromise(
  //       db.transaction(tx => {
  //             console.log(`set soundSwitch : ${config.soundSwitch}, soundName : ${config.soundName}, pageSize : ${config.pageSize}`);
  //             tx.executeSql(`update config set soundSwitch =?, soundName = ?, pageSize = ? `, [config.soundSwitch, config.soundName, config.pageSize])
  //       })
  //     )
  //   )
  //   return res;
  // }

  loadConfig(): Observable<Config>
  {
    console.log('loadConfig Start...');
    return Observable.fromPromise(this.storage.get('config')).map(
      val => {
        if (val)
        {
           console.log('load config is', val);
           UmdConfigProvider.config = val;
        }else
        {
           UmdConfigProvider.config = {soundSwitch: true, soundName: 'bell', pageSize: 8};
           this.storage.set('config', UmdConfigProvider.config);
           console.log('load Config is', UmdConfigProvider.config);  
        }
        return UmdConfigProvider.config;
      }
    )
  }

  getConfig(): Config
  {
    // return Observable.fromPromise(this.storage.get('config')).map(
    //   val => {
    //     console.log('get config 1 is', val);
    //     UmdConfigProvider.config = val;
    //     return UmdConfigProvider.config;
    //   }
    // )
    return UmdConfigProvider.config;
  }

  updateConfig(config:Config): Observable<boolean>
  {
    return Observable.fromPromise(this.storage.set('config', config)).map(
       val => {
         console.log('UpdateConfig Finish : config is ', val);
         return true;
       }
    )
  }

}
