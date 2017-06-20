import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Department } from '../../models/department'
import { DepartmentProvider } from '../../providers/department-provider'
import { Observable } from 'rxjs/Rx'
import { AlarmAction } from '../../models/alarm-action';

/*
  Generated class for the DepartmentSelect page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-department-select',
  templateUrl: 'department-select.html'
})
export class DepartmentSelectPage {
  departments : Department[] = [];
  filterDepartmentIDs : Set<string> = new Set<string>();
  pageTitle = "選擇部門";
  callback : (Department);
  selectedDepartment: Department= null;
  pattern : string;
  selectedAlarmAction : AlarmAction = null;
  alarmActions: AlarmAction[] = [];
  actionType: number;
  filterDepartments: Department[];
  filterAlarmActions: AlarmAction[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: DepartmentProvider) 
  {
    this.filterDepartments = navParams.get("filterDepartments");
    this.filterAlarmActions = navParams.get("filterAlarmActions");
    this.actionType = navParams.get("actionType");
    if (this.filterDepartments)
    {
      this.filterDepartments.forEach(department => {
        this.filterDepartmentIDs.add(department.deptId);
      });
    }else if (this.filterAlarmActions)
    {
      this.filterAlarmActions.forEach(alarmAction => {
        if (alarmAction.actionType == this.actionType) {this.filterDepartmentIDs.add(alarmAction.actionValue);}
      });
    }
    
    var me = this;
    this.pattern = "";
    this.getDepartments(this.pattern).subscribe(m => me.departments = m);
    let title: string = navParams.get("pageTitle");
    if (null != title && title.trim().length > 0)
    {
        this.pageTitle = title;
    }
  }


  getDepartments(pattern?: string) :  Observable<Department[]>
  {
      var me = this;
      let departments = this.provider.getDepartments(pattern);
      return departments.map((x, idx) => {
        let output : Department[] = [];
        x.forEach(department => {
          if (!me.filterDepartmentIDs.has(department.deptId))
          {
            output.push(department);
          }      
        });
        return output;
      });
  }

  onInput($event)
  {
    var me = this;
    this.getDepartments(this.pattern).subscribe( m => me.departments = m);    
  }


  selectDepartment(department: Department)
  {
    if (department != null)
    { 
      this.selectedDepartment = this.selectedDepartment === department ? null : department;
      this.selectedAlarmAction = {
        actionType: this.actionType, 
        actionValue: department.deptId, 
        chatName:"", 
        enabled: true, 
        name: department.deptName, 
        mailEmpId:"",
        isDept: true
     };
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepartmentSelectPage'); 
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
      }else if (this.filterDepartments)
      {
         callback(this.selectedDepartment).then(()=>{
          this.navCtrl.pop();   
         });
      }
    }
  }

}
