import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from '../../providers/api';
import { Group } from '../../models/group';
import { MESSAGES } from '../MESSAGES'

import 'rxjs/add/operator/map';

/*
  Generated class for the Message provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GropuProvider {
  getGroup(owner: string) : Group[]
  {
    return null;
  }
  updateGroup(user: string, group: Group) 
  {
    return null;
  }
  deleteGroup(user: string, groupId: string) 
  {
    return null;
  }
}