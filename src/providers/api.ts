import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Api provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class Api {
  static toCamel(o): any {
    var newO, origKey, newKey, value
    if (o instanceof Array) {
      newO = []
      for (origKey in o) {
        value = o[origKey]
        if (typeof value === "object") {
          value = this.toCamel(value)
        }
        newO.push(value)
      }
    } else {
      newO = {}
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
          value = o[origKey]
          if (value !== null && (value.constructor === Object || value instanceof Array)) {
            value = this.toCamel(value)
          }
          newO[newKey] = value
        }
      }
    }
    return newO
  }
  
  static toPascal(o): any {
    var newO, origKey, newKey, value
    if (o instanceof Array) {
      newO = []
      for (origKey in o) {
        value = o[origKey]
        if (typeof value === "object") {
          value = this.toPascal(value)
        }
        newO.push(value)
      }
    } else {
      newO = {}
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toUpperCase() + origKey.slice(1) || origKey).toString()
          value = o[origKey]
          if (value !== null && (value.constructor === Object || value instanceof Array)) {
            value = this.toPascal(value)
          }
          newO[newKey] = value
        }
      }
    }
    return newO
  }
  
  static getHttpUrl(funcName: string): any {
     let apiConnect: string = "CIM";  //MIS,CIM
     let serverUrl: string = "";
     if (apiConnect === "CIM"){
    
        // serverUrl = "https://apptest.innolux.com/agency/api/proxy/c18ac7b5-bbfa-8919-eb8e-b3fe20e2ac93/";
        // serverUrl = "http://tnvtwebapi.cminl.oa/NewWebApi/Agency/api/service/c18ac7b5-bbfa-8919-eb8e-b3fe20e2ac93/";
         serverUrl = "http://c4c010685.cminl.oa/UMD/Services/UMDDataService.svc/";
        // serverUrl = "http://c3c003309.cminl.oa/UMD/Services/UMDDataService.svc/";
     }else if (apiConnect === "MIS"){
      serverUrl = "http://ptnecimumd.cminl.oa/Services/UMDDataService.svc/";
     }
     return serverUrl + funcName;
  }

  
}
