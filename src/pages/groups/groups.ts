import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GroupProvider } from '../../providers/group-provider'
import { Group } from '../../models/group'
import { GroupEditPage } from '../group-edit/group-edit'
import { AccountProvider } from '../../providers/account-provider'
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {
  groups : Group[];
  searching: boolean = false;
  constructor(public navCtrl: NavController, public provider: GroupProvider, public alertCtrl:AlertController, 
              public loading: LoadingController,  public accountProvider: AccountProvider) {

  } 

  ionViewDidLoad() {
    //  let loader = this.loading.create({
    //     content: 'Loading...',
    //   });

    //  loader.present();
      this.searching = true;
      this.provider.getGroups(this.accountProvider.getInxAccount().empNo,'').subscribe(
          value => {
              this.searching = false;
              this.groups = value
              // loader.dismiss();
            },
          error => {
            this.searching = false;
            this.groups = [];
            let alert = this.alertCtrl.create({
              title: "錯誤",
              message: JSON.stringify(error)
            })
            alert.present();
          },
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
  let alert = this.alertCtrl.create({
    title: '刪除群組',
    message: '群組:'+ group.groupName +'?',
    buttons: [
      {
        text: 'Cancel',
        handler: () => {
          console.log('Cancel Group');
        }
      },
      {
        text: 'OK',
        handler: () => {
              this.provider.deleteGroup(group.groupId ,this.accountProvider.getInxAccount().empNo).subscribe(
                     value => {
                         if(value) this.groups.splice(this.groups.indexOf(group), 1);
                         console.log("delete Group :" + value);
                        }
              );
        }
      }
    ]
  });
  alert.present();

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
