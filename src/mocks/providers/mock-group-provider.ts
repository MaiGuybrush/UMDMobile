import { Injectable } from '@angular/core';
import { Group } from '../../models/group';
import { GROUPS } from '../GROUPS'
import { Employee } from '../../models/employee';
import { GROUPDETAILS } from '../GROUP-DETAILS'
import { GroupProvider } from '../../providers/group-provider'
import { Observable } from 'rxjs/Rx'

import 'rxjs/add/operator/map';

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MockGroupProvider implements GroupProvider {
  constructor() {
  }
  
  getGroups(owner: string, pattern?: string) : Observable<Group[]>
  {
    let output: Group[] = [];
    let tempGroups: Group[] = [];
    let remainsGroups: Group[];
    if (!pattern || 0 === pattern.trim().length)
    {
      return Observable.from([GROUPS]);
    }
    let searchPattern = new RegExp('.*' + pattern + '.*', "i");
    GROUPS.forEach(element => {
      if (searchPattern.test(element.groupName))
      {
        output.push(element);
      }
      else
      {
        tempGroups.push(element);        
      }
    });
    remainsGroups = tempGroups;
    remainsGroups.forEach(element => {
      if (searchPattern.test(element.description))
      {
        output.push(element);
      }
    });

    return Observable.from([output]);
  }

  getGroupEmployee(groupId: string) : Observable<Employee[]>
  {
    let output: Employee[] = [];
    let bl: boolean = false;
     GROUPDETAILS.forEach(element => {
       if (bl === false) {
         if (groupId === element.groupId)
         {
         output = element.groupUserList;
         bl = true;
         }
       }
    });
    
     return Observable.from([output]);
  }

  addGroup(groupName: string,description:string,groupUsers:string[],empId:string): Observable<boolean>
  {
    return  Observable.from([true]);
  }

  updateGroup(groupId: string, groupName: string, description:string,leftGroupUsers:string[],newGroupUsers:string[],empId:string): Observable<boolean>
  {
    return  Observable.from([true]);
  }
  
  deleteGroup(groupId: string,empId: string): Observable<boolean>
  {
    return null;
  }
}