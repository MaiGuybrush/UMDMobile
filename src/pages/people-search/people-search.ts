import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'
import { FormControl } from '@angular/forms'
import { Employee } from '../../models/employee'
import { EmployeeProvider } from '../../providers/employee-provider'
import { Observable } from 'rxjs/Rx'
import { AccountProvider } from '../../providers/account-provider'
import { AlarmAction } from '../../models/alarm-action';

/*
  Generated class for the PeopleSearch page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-people-search',
  templateUrl: 'people-search.html'
})
export class PeopleSearchPage {
  employees : Employee[] = [];
  filterEmployeeIDs : Set<string> = new Set<string>();
  pageTitle = "選擇人員";
  callback : (Employee);
  selectedEmployee : Employee = null;
  pattern : string;
  searchControl: FormControl;
  searching: boolean = false;
  selectedAlarmAction : AlarmAction = null;
  alarmActions: AlarmAction[] = [];
  actionType: number;
  filterEmployees: Employee[];
  filterAlarmActions: AlarmAction[];
  queryPage: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: EmployeeProvider,
                                             public accountProvider: AccountProvider) 
  {
    this.searchControl = new FormControl();
    this.filterEmployees = navParams.get("filterEmployees");
    this.filterAlarmActions = navParams.get("filterAlarmActions");
    this.actionType = navParams.get("actionType");
    if (this.filterEmployees)
    {
      this.filterEmployees.forEach(employee => {
        this.filterEmployeeIDs.add(employee.empId);
      });
    }
    else if (this.filterAlarmActions)
    {
      this.filterAlarmActions.forEach(alarmAction => {
        if (alarmAction.actionType == this.actionType) {this.filterEmployeeIDs.add(alarmAction.actionValue);}
      });
    }

    // this.employees = [];    
    // this.pattern = "";

    let title: string = navParams.get("pageTitle");
    if (null != title && title.trim().length > 0)
    {
        this.pageTitle = title;
    }
  }

  // getEmployees(owner: string, pattern?: string) : Observable<Employee>
  // {
  //   var me = this;
  //   return Observable.from(this.provider.getEmployees('10004698', pattern).toArray()[0])
  //   .filter( (obs, idx) =>
  //            {
  //              return me.filterEmployeeIDs.has(obs[idx].empNo);
  //            }
  //          );
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PeopleSearchPage');
//     this.setFilteredItems();

        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
            this.searching = false;
            if (search.length > 0)
            {
              // var me = this;
              this.queryPage =1;
              this.getEmployees().subscribe( m => {
                this.employees = m
              });    
            }
            else
            {
              this.employees = [];
            }
 
        });    
  }

  getEmployees() : Observable<Employee[]>
  {
    // var me = this;
    // let employees =this.provider.getEmployees(this.accountProvider.getInxAccount().empNo, this.pattern).subscribe(res => me.employees = res);
    let employees =this.provider.getEmployees(this.accountProvider.getInxAccount().empNo, this.pattern, this.queryPage);
    if (employees!= null) this.queryPage +=1;
    return employees.map((x, idx) => {
        let output : Employee[] = [];
        x.forEach(employee => {
          if (!this.filterEmployeeIDs.has(employee.empId) && !this.filterEmployeeIDs.has(employee.adId) )
          {
            output.push(employee);
          }      
        });
        return output;
      });

  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

      setTimeout(() => {
       this.getEmployees().subscribe( m => {
        this.employees = this.employees.concat(m);
        console.log('Async operation has ended:' + this.employees.length);
         infiniteScroll.complete();
       });
      }, 500);
  }

  onSearchInput()
  {
    this.searching = true;
    this.queryPage =1;
  }
  // onInput($event)
  // {
  //   this.getEmployees();
  // }

  // onCancel()
  // {

  // }

  // onClear()
  // {

  // }

  selectEmployee(employee: Employee)
  {
    if (employee != null)
    { 
      this.selectedEmployee = this.selectedEmployee === employee ? null : employee;
      if (this.filterAlarmActions){
      this.selectedAlarmAction = {
        actionType: this.actionType, 
        actionValue: this.actionType === 1 ? employee.adId :employee.empId,
        chatName:"", 
        enabled: true,
        name: employee.name,
        mailEmpId: employee.empId,
        isDept: false
      };
      }
    }
  }

  done()
  {
    let callback = this.navParams.get('callback');

    if(callback != null)
    {
       if (this.filterAlarmActions)
       {
         callback(this.selectedAlarmAction).then(()=>{
          this.navCtrl.pop();   
         });
       }else if (this.filterEmployees)
       {
         callback(this.selectedEmployee).then(()=>{
          this.navCtrl.pop();   
         });
       }
    }
  }
  
}
