import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular'
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DbProvider {
  protected dbInstance: SQLiteObject
  static dbName: string = "umd_storage_004";  
  constructor(public platform: Platform, public http: Http, public sqlite: SQLite) {
  }

  ready(): Promise<SQLiteObject>
  {
     return new Promise((resolve, reject) => {        
      this.platform.ready().then(m => {
        this.sqlite.create({ name: DbProvider.dbName, location: "default" }).then(m => {
          this.dbInstance = m;
          resolve(this.dbInstance);
        }).catch( e => {
          console.log("initial db fail, " + JSON.stringify(e))
          reject(e)
        })
      })
    });

  }

  getDB()
  { 
    return this.dbInstance;
  }
}
