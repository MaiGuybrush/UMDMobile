
import { Observable } from 'rxjs/Rx'
import { Config } from '../models/config';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

export abstract class ConfigProvider {
  abstract loadConfig(): Observable<Config>;
  abstract getConfig(): Config;
  abstract updateConfig(config: Config): Observable<boolean>;
}

