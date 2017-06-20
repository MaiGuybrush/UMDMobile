import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { GroupProvider } from '../../providers/group-provider'
import { Group } from '../../models/group'
import { GroupEditPage } from '../group-edit/group-edit'
import { Observable } from 'rxjs/Rx'
import { AccountProvider } from '../../providers/account-provider'
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {
  groups : Group[];
  isSuccess : boolean;
  constructor(public navCtrl: NavController, public provider: GroupProvider,
              public loading: LoadingController,  public accountProvider: AccountProvider) {

  } 

  ionViewDidLoad() {
     let loader = this.loading.create({
        content: 'Loading...',
      });

     loader.present();
      this.provider.getGroups(this.accountProvider.getInxAccount().empNo,'').subscribe(
          value => {
              this.groups = value
              loader.dismiss();
            },
          error => this.groups = [],
          () => console.log("done")
      );
    console.log('ionViewDidLoad SubscribeEditPage');
  }

  gotoEdit(group: Group): void
  {
      this.navCtrl.push(GroupEditPage, {'callback': this.callbackFunction, 'group': group});
  }

  doDelete(group: Group): void
  {
   this.groups.splice(this.groups.indexOf(group), 1);
   this.provider.deleteGroup(group.groupId ,this.accountProvider.getInxAccount().empNo).subscribe(
          value => this.isSuccess = value,
          () => console.log("deleteGroup" +this.isSuccess)
      );
  }

  callbackFunction = () => 
  {
      this.provider.getGroups(this.accountProvider.getInxAccount().empNo,'').subscribe(
          value => this.groups = value,
          error => this.groups = [],
          () => console.log("callback")
      );
  }

}
