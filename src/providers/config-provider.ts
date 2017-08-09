
import { Observable } from 'rxjs/Rx'
import { Config } from '../models/config';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

export abstract class ConfigProvider {

  abstract init(config: Config): Observable<any>;
  abstract getConfig() : Observable<Config>;
  abstract updateConfig(config: Config): Observable<any>;
}

