import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { InxAccount } from '../../models/inx-account'
import { AccountProvider } from '../../providers/account-provider'
/*
 * @name ExtraInfoX
 * @description
 * Get InxAuth information
 * Requires {@link module:driftyco/ionic-native} and the Cordova plugin: 'ExtraInfo'
 */
@Injectable()
export class MockAccountProvider implements AccountProvider
{
    static sharon: InxAccount =  {
          'comid': "sharon.tsai",
          'deveceKey': "",
          'empNo': "14127785",
          'name': "蔡世真",
          'accessToken': "",
          'refreshToken': ""
        };
    static account: InxAccount = undefined;
    constructor()
    {

    }
    getInxAccount() : InxAccount
    {   
        return MockAccountProvider.account;        
    }

    getUserInfo(): Observable<InxAccount> {
        return Observable.create(observer => {
            setTimeout(() => {
            MockAccountProvider.account = MockAccountProvider.sharon;
            observer.next(MockAccountProvider.account);
            observer.complete();
            }, 5000);
        });
    }

    // updateUserInfo(empId:string, deviceToken: string): Observable<boolean>{
    //     return Observable.from([true]);
    // }

}