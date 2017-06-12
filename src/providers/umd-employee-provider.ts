import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http'
import { Api } from './api'
import { Observable } from 'rxjs/Rx';
import { Employee } from '../models/employee';
import { EmployeeProvider } from './employee-provider'
import { InterceptedHttp} from '../app/intercepted-http'

@Injectable()
export class UmdEmployeeProvider implements EmployeeProvider {

  prePattern: string = "";
  preEmpId: string = "";
  preResult: Employee[] = [];
  constructor(public http: Http) {
  }

  getEmployees(empID: string, pattern: string) : Observable<Employee[]>
  {
    if (this.isSubSearch(empID, pattern))
    {
      return this.getEmployeeFromCache(pattern);
    }
    else
    {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

  //     let url = 'http://localhost:3000/getGroups';
        // let url = 'http://c4c010685.cminl.oa/UMD/Services/UMDDataService.svc/GetEmployeeData';
  //     let url = 'http://tnvtwebapi.cminl.oa/NewWebApi/Agency/api/service/??????';
      let url = Api.getHttpUrl('GetEmployeeData');

      let body = {"EmpId": `${empID}`, "Keyword": `${pattern}`, "QueryPage": 1};

      let err = "";
      console.log('post start');
      let output = this.http.post(url, body, options).map(res => 
                        Api.toCamel(res.json()).employeeList
                      );
      var me = this;
      output.subscribe(m => {
        me.preResult = m;
        me.preEmpId = empID;
        me.prePattern = pattern;
      });
      return output;
    }
  }

  isSubSearch(newEmpId:string, newPattern:string) : boolean
  {
    if(newEmpId === this.preEmpId)
    {
      return newPattern.length > 0 && newPattern.indexOf(this.prePattern) >= 0;
    }
    return false;
  }

  getEmployeeFromCache(pattern: string) : Observable<Employee[]>
  {

    if(pattern === this.prePattern)
    {
      return Observable.from([this.preResult]);
    }

    let comidPattern = new RegExp('^[a-z].*', "i");
    let empnoPattern = new RegExp('^[0-9].*');
    let output: Employee[] = [];
    let searchPattern = new RegExp('.*' + pattern + '.*', "i");
   
    if (comidPattern.test(pattern))
    {
        this.preResult.forEach(element => {
          if (searchPattern.test(element.adId))
          {
            output.push(element);
          }
        });
    }
    else if (empnoPattern.test(pattern))
    {
        this.preResult.forEach(element => {
          if (searchPattern.test(element.empId))
          {
            output.push(element);
          }
        });
    }
    else 
    {
        this.preResult.forEach(element => {
          if (searchPattern.test(element.name))
          {
            output.push(element);
          }
        });
    }
    
    return Observable.from([output]);
  }


}
