import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { Group } from '../../models/group';
import { Employee } from '../../models/employee';
import { PeopleSearchPage } from '../people-search/people-search';
import { GroupsPage } from '../groups/groups';
import { DepartmentSelectPage } from '../department-select/department-select';
import { GroupProvider } from '../../providers/group-provider'
import { AccountProvider } from '../../providers/account-provider'
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-group-edit',
  templateUrl: 'group-edit.html'
})
export class GroupEditPage {
  group: Group
  oemployees: Employee[] = [];
  dempStr= [];  //刪除原先群組人員
  nemployees: Employee[] = [];
  nempStr=[];  //新增群組人員
  // items: string[] = ['CIM'];
  isSuccess: boolean;
  groupName: string ="";
  description: string ="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController,
              public GroupProvider: GroupProvider, public loading: LoadingController, public accountProvider: AccountProvider) {
  }

  ionViewDidLoad() {
     let loader = this.loading.create({
        content: 'Loading...',
      });

     loader.present();
          this.group = this.navParams.get('group');
          var me = this;
          if (this.group != null){
          this.groupName = this.group.groupName;
          this.description = this.group.description;
          this.GroupProvider.getGroupEmployee(this.group.groupId).subscribe(
              m => {
                    this.oemployees = m
                    if(m) loader.dismiss();
                    }
              );
          }else{
            loader.dismiss();
          }

    console.log('ionViewDidLoad SubscribeEditPage');
  }

  SearchClick()
  {
   this.navCtrl.push(PeopleSearchPage, {'callback': this.callbackFunction, 'pageTitle': "選擇人員", 'filterEmployees': this.nemployees})
  }
  
  callbackFunction = (params) => 
  {
     return new Promise((resolve, reject) => {
            if (params)
            {
//              this.groups.push(params);
              this.nemployees.push(params);
            }
            resolve();
         });
  }

  doDelete(i,emptype: string): void
  {
    if(emptype ==="oemployee"){
     this.dempStr.push(this.oemployees[i].empId);
     this.oemployees.splice(i, 1);
   }else if (emptype ==="nemployee"){
     this.nemployees.splice(i, 1);
   }
  }

  done()
  {
      this.nemployees.forEach(employee => {
            this.nempStr.push(employee.empId);    
      });

      if (this.group != null){
          this.GroupProvider.updateGroup(this.group.groupId,this.groupName,this.description,this.dempStr,this.nempStr,
                                         this.accountProvider.getInxAccount().empNo).subscribe(
                                           m => {
                                             this.navCtrl.pop();
                                            }
                                           );
      }else
      {
          this.GroupProvider.addGroup(this.groupName,this.description,this.nempStr,
                                      this.accountProvider.getInxAccount().empNo).subscribe(                                           
                                           m => {
                                             this.navCtrl.setRoot(GroupsPage);
                                            });
      }

  }

}
