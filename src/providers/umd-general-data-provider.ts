import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { Api } from './api'
import { Observable } from 'rxjs/Rx';
import { GeneralDataProvider } from './general-data-provider'

@Injectable()
export class UmdGeneralDataProvider implements GeneralDataProvider {
    constructor(public http: Http) {
    console.log('Hello General Data Provider');
  }


  getAlarmTypes() : Observable<string[]>
  {

     let url = Api.getHttpUrl('GetAlarmTypes');

     console.log('get start');
     return this.http.get(url).map(res => 
                      Api.toCamel(res.json().AlarmTypes)
                    );
  }


}