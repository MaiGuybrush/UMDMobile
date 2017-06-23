import { Observable } from 'rxjs/Observable'
import { AppConfig } from '../providers/app-config'
import { Injectable } from '@angular/core';
import { InxAccount } from '../models/inx-account'
import { AccountProvider } from './account-provider'
import { Api } from './api'
import { Http, Headers, RequestOptions } from '@angular/http'
declare var ExtraInfo: any;

/*
 * @name ExtraInfoX
 * @description
 * Get InxAuth information
 * Requires {@link module:driftyco/ionic-native} and the Cordova plugin: 'ExtraInfo'
 */
@Injectable()
export class ExtraInfoProvider implements AccountProvider
{
    private static account: InxAccount;
    constructor(public appConfig: AppConfig)
    {

    }
    getInxAccount() : InxAccount
    {
        return ExtraInfoProvider.account;
    }
    authInfoDataObserver : any;
    authResultObserver: any;
    authInfoData: Observable<any> = null;
    authResult : Observable<any>;
    accessToken: string;
    getUserInfo(): Observable<InxAccount> {
        var me: ExtraInfoProvider = this;
        return Observable.create(observer => {
            ExtraInfo.getUserInfo(
                (result) => {
                    me.accessToken = result["accessToken"];
                    ExtraInfoProvider.account = result;
                    observer.next(result);
                    observer.complete();
                }, 
                (err) => {
                    me.accessToken = "";
                    ExtraInfoProvider.account = undefined;
//                    observer.next(err);
                    observer.error();
                    observer.complete();                    
                }, this.appConfig.appID)
        })
    }


  
    verifyWithAppID(): Observable<any> {
        var me: ExtraInfoProvider = this;
        return Observable.create(observer => {
            ExtraInfo.verifyWithAppID(
                (result) => {
                    me.accessToken = result["accessToken"];
                    observer.next(result);
                    observer.complete();
                }, 
                (err) => {
                    me.accessToken = "";
                    observer.next(err);
                    observer.error();
                }, this.appConfig.appID)
        })
    }

}