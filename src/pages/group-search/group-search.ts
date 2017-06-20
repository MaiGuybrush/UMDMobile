import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'
import { Group } from '../../models/group'
import { GroupProvider } from '../../providers/group-provider'
import { Observable } from 'rxjs/Rx'
import { AccountProvider } from '../../providers/account-provider'
import { AlarmAction } from '../../models/alarm-action';
/*
  Generated class for the PeopleSearch page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-group-search',
  templateUrl: 'group-search.html'
})
export class GroupSearchPage {
  groups : Group[] = [];
  filterGroupIDs : Set<string> = new Set<string>();
  pattern : string ;
  pageTitle = "選擇群組";
  callback : (Group);
  selectedGroup : Group = null;
  selectedAlarmAction : AlarmAction = null;
  alarmActions: AlarmAction[] = [];
  actionType: number;
  filterGroups: Group[];
  filterAlarmActions: AlarmAction[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: GroupProvider
                                                                        , public accountProvider: AccountProvider)  
  {
    this.filterGroups = navParams.get("filterGroups");
    this.filterAlarmActions =navParams.get("filterAlarmActions");
    this.actionType = navParams.get("actionType");
    if (this.filterGroups)
    {
      this.filterGroups.forEach(group => {
        this.filterGroupIDs.add(group.groupId);
      });
    }
    else if (this.filterAlarmActions)
    {
      this.filterAlarmActions.forEach(alarmAction => {
        if (alarmAction.actionType == this.actionType) {this.filterGroupIDs.add(alarmAction.actionValue);}
      });
    }
    var me = this;
    this.pattern ="";
    this.getGroups(this.accountProvider.getInxAccount().empNo, this.pattern).subscribe({
        next: m => me.groups = m,
        error: (result) => console.log(result)
    });    
    // this.pattern ="";
    // this.getGroups(this.accountProvider.getInxAccount().empNo, this.pattern).subscribe(m => me.groups = m);
    let title: string = navParams.get("pageTitle");
    if (null != title && title.trim().length > 0)
    {
        this.pageTitle = title;
    }
  }

  getGroups(owner: string, pattern?: string) : Observable<Group[]>
  {
      var me = this;
      let groups = this.provider.getGroups(owner, pattern);
      return groups.map(x => {
        let output : Group[] = [];
        if (x != null)
        {
          x.forEach(group => {
            if (!me.filterGroupIDs.has(group.groupId))
            {
              output.push(group);
            }      
          
          });
        }
        return output;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PeopleSearchPage');
  }

  ionViewDidLeave()
  {
    console.log('ionViewDidLeave PeopleSearchPage');
  }

  onInput($event)
  {
    var me = this;
    this.getGroups(this.accountProvider.getInxAccount().empNo, this.pattern).subscribe( m => me.groups = m);    
  }

  onCancel()
  {

  }

  onClear()
  {

  }

  selectGroup(group: Group)
  {
    if (group != null)
    { 
      this.selectedGroup = this.selectedGroup === group ? null : group;
      this.selectedAlarmAction = {
        actionType: this.actionType, 
        actionValue: group.groupId, 
        chatName:"", 
        enabled: true, 
        name: group.groupName, 
        mailEmpId:"",
        isDept: false 
      };
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
      }else if (this.filterGroups)
      {
         callback(this.selectedGroup).then(()=>{
          this.navCtrl.pop();   
         });
      }
    }
  }

}
