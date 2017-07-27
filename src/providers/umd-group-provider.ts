import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'
import { Api } from './api'
import { Group } from '../models/group'
import { Employee } from '../models/employee';
import { GroupProvider } from './group-provider'
import { Observable } from 'rxjs/Rx'

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable(
)
export class UmdGroupProvider implements GroupProvider {

  constructor(public http: Http) {
    console.log('Hello Group Provider');
  }


  getGroups(empId:string, pattern?: string) : Observable<Group[]>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

//     let url = 'http://localhost:3000/getGroups';
      //  let url = 'http://c4c010685.cminl.oa/UMD/Services/UMDDataService.svc/GetGroupData';
//     let url = 'http://tnvtwebapi.cminl.oa/NewWebApi/Agency/api/service/e1c5da29-9bf6-cf83-72fb-76d287c98bdb';

     let url = Api.getHttpUrl('GetGroupData');

     let body = {"EmpId": `${empId}`, "Keyword": `${pattern}`};
    //  let output = [];
     console.log('post start');
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).groupDataList
                    );
  }

  getGroupEmployee(groupId:string) : Observable<Employee[]>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('GetGroupDetailData');

     let body = {"GroupId": `${groupId}`};
     console.log('post start');
     
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).groupData.groupUserList
                    );
  }

  addGroup(groupName: string,description:string,groupUsers:string[],empId:string): Observable<boolean>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('InsertGroup');

     let body = {"GroupName": `${groupName}`,"Description": `${description}`,"GroupUsers": groupUsers,"EmpId": `${empId}`};
     console.log('post start');
     
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).isSuccess
                    );
  }

  updateGroup(groupId: string, groupName: string, description:string,leftGroupUsers:string[],newGroupUsers:string[],empId:string): Observable<boolean>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('ModifyGroup');

    //  let gid:number = parseInt(groupId);

     let body = {"GroupId": groupId,"GroupName": `${groupName}`,"Description": `${description}`,
                 "LeftGroupUsers": leftGroupUsers,"NewGroupUsers": newGroupUsers,"EmpId": `${empId}`};
     console.log('post start');
     
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).isSuccess
                    );
  }

  deleteGroup(groupId: string,empId: string): Observable<boolean>
  {
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

     let url = Api.getHttpUrl('DeleteGroup');

    //  let gid:number = parseInt(groupId);

     let body = {"GroupId": groupId,"EmpId": `${empId}`};

     console.log('post start');
     
     return this.http.post(url, body, options).map(res => 
                      Api.toCamel(res.json()).isSuccess
                    );
  }
  
}
