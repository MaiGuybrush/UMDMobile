import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core'
import { Push } from '@ionic-native/push'
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HttpModule, Http, XHRBackend, RequestOptions  } from '@angular/http'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { SQLite } from '@ionic-native/sqlite'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { Device } from '@ionic-native/Device'
import { MyApp } from './app.component'
import { InterceptedHttp } from './intercepted-http'
import { PureHttp } from './pure-http'
import { FilterPipe } from './filter.pipe.ts'
import { GroupByPipe } from './groupby.pipe.ts'
// import { OrderByPipe } from './orderby.pipe.ts'
import { AboutPage } from '../pages/about/about'
import { AuthTestPage } from '../pages/auth-test/auth-test'
import { ConfigPage } from '../pages/config/config'
//import { CategorizedMessagesPage } from '../pages/categorized-messages/categorized-messages'
import { CategorizedMessagesPageModule } from '../pages/categorized-messages/categorized-messages.module'
import { MessagesPage } from '../pages/messages/messages'
import { MessagesDetailPage } from '../pages/messages-detail/messages-detail'
import { GroupsPage } from '../pages/groups/groups'
import { GroupEditPage } from '../pages/group-edit/group-edit'
import { SubscribePage } from '../pages/subscribe/subscribe'
import { SubscribeAddPage } from '../pages/subscribe-add/subscribe-add'
import { SubscribeEditPage } from '../pages/subscribe-edit/subscribe-edit'
import { SubscribeConfigPage } from '../pages/subscribe-config/subscribe-config'
import { SubscribeMappgroupPage } from '../pages/subscribe-mappgroup/subscribe-mappgroup'
import { InitPage } from '../pages/init/init'
import { TabsPage } from '../pages/tabs/tabs'
import { PeopleSearchPage } from '../pages/people-search/people-search'
import { GroupSearchPage } from '../pages/group-search/group-search'
import { DepartmentSelectPage } from '../pages/department-select/department-select'
import { MessageComponent } from '../components/message/message.component'
import { MessageDetailComponent } from '../components/message-detail/message-detail.component'
import { GroupComponent } from '../components/group/group.component'
import { EmployeeComponent } from '../components/employee/employee.component'
import { GroupEditComponent } from '../components/group-edit/group-edit.component'
//import { MessageCategoryComponent } from '../components/message-category/message-category.component'
import { SubscriptionComponent } from '../components/subscription/subscription.component'
import { NosubscriptionComponent } from '../components/nosubscription/nosubscription.component'
import { DepartmentComponent } from '../components/department/department.component'
import { AlarmActionComponent } from '../components/alarm-action/alarm-action.component'
import { AlarmActionSettingComponent } from '../components/alarm-action-setting/alarm-action-setting.component'
import { ConfigComponent } from '../components/config/config.component'
import { MessageProvider } from '../providers/message-provider'
import { GroupProvider } from '../providers/group-provider'
import { DepartmentProvider } from '../providers/department-provider'
import { AppConfig } from '../providers/app-config'
import { GeneralDataProvider } from '../providers/general-data-provider'
import { PushProvider } from '../providers/push-provider'
import { AccountProvider } from '../providers/account-provider'
import { EmployeeProvider } from '../providers/employee-provider'
import { ExtraInfoProvider } from '../providers/extrainfo-provider'
import { SubscriptionProvider } from '../providers/subscription-provider'
import { AlarmProvider } from '../providers/alarm-provider'
import { ConfigProvider } from '../providers/config-provider'
import { FcmPushProvider } from '../providers/fcm-push-provider'
import { UmdGroupProvider } from '../providers/umd-group-provider'
import { UmdMessageProvider } from '../providers/umd-message-provider'
import { UmdEmployeeProvider } from '../providers/umd-employee-provider'
import { UmdDepartmentProvider } from '../providers/umd-department-provider'
import { UmdGeneralDataProvider } from '../providers/umd-general-data-provider'
import { UmdSubscriptionProvider } from '../providers/umd-subscription-provider'
import { UmdAlarmProvider } from '../providers/umd-alarm-provider'
import { UmdConfigProvider } from '../providers/umd-config-provider'
import { MockEmployeeProvider } from '../mocks/providers/mock-employee-provider'
import { MockGroupProvider } from '../mocks/providers/mock-group-provider'
import { MockGroupDetailProvider } from '../mocks/providers/mock-group-detail-provider'
import { MockDepartmentProvider } from '../mocks/providers/mock-department-provider'
import { MockGeneralDataProvider } from '../mocks/providers/mock-general-data-provider'
import { MockMessageProvider } from '../mocks/providers/mock-message-provider'
import { MockSubscriptionProvider } from '../mocks/providers/mock-subscription-provider'
import { MockAccountProvider } from '../mocks/providers/mock-account-provider'
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { IonicStorageModule } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version';


import { DbProvider } from '../providers/db/db';
@NgModule({
  declarations: [
    MyApp,
    FilterPipe,
    GroupByPipe,
//    OrderByPipe,
    AboutPage,
    AuthTestPage,
    ConfigPage,
    // CategorizedMessagesPage,
    MessagesPage,
    MessagesDetailPage,
    SubscribePage,
    SubscribeAddPage,
    SubscribeEditPage,
    SubscribeConfigPage,
    SubscribeMappgroupPage,
    GroupsPage,
    GroupEditPage,
    MessageDetailComponent,
    MessageComponent,
//    MessageCategoryComponent,
    EmployeeComponent,
    GroupComponent,
    GroupEditComponent,
    SubscriptionComponent,
    AlarmActionComponent,
    AlarmActionSettingComponent,
    ConfigComponent,
    PeopleSearchPage, 
    GroupSearchPage,
    DepartmentSelectPage,
    ConfigPage,
    TabsPage,
    DepartmentComponent,
    NosubscriptionComponent,
    InitPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    CategorizedMessagesPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AuthTestPage,
    ConfigPage,
    // CategorizedMessagesPage,
    MessagesPage,
    MessagesDetailPage,
    SubscribePage,
    SubscribeAddPage,
    SubscribeEditPage,
    SubscribeConfigPage,
    SubscribeMappgroupPage,
    GroupsPage,
    GroupEditPage,
    PeopleSearchPage, 
    GroupSearchPage,
    DepartmentSelectPage,
    ConfigPage,
    InitPage,
    TabsPage
  ],
  providers: [
              {provide: ErrorHandler, useClass: IonicErrorHandler} 
            , {provide: GroupProvider, useClass: UmdGroupProvider}
            , {provide: EmployeeProvider, useClass: UmdEmployeeProvider}
            , {provide: DepartmentProvider, useClass: UmdDepartmentProvider}
            , {provide: GeneralDataProvider, useClass: UmdGeneralDataProvider}
            , {provide: SubscriptionProvider, useClass: UmdSubscriptionProvider}
            , {provide: AlarmProvider, useClass: UmdAlarmProvider}
            , {provide: ConfigProvider, useClass: UmdConfigProvider}
            , {provide: PushProvider, useClass: FcmPushProvider}
            , AppConfig
            , ExtraInfoProvider
            , LocalNotifications
            , Push
            , StatusBar
            , SQLite
            , Device
            , SplashScreen
            , UniqueDeviceID
            , AppVersion
            , {
                provide: PureHttp,
                useFactory: (backend: XHRBackend, options: RequestOptions) => {
                  return new PureHttp(backend, options);
                },
                deps: [XHRBackend, RequestOptions]                
              }
//for web
//            , {provide: AccountProvider, useClass: MockAccountProvider}
            // , {
            //     provide: Http,
            //     useFactory: (backend: XHRBackend, options: RequestOptions, extraInfoProvider: ExtraInfoProvider) => {
            //       return new Http(backend, options);
            //     },
            //     deps: [XHRBackend, RequestOptions, ExtraInfoProvider]
            //   }
            // , {provide: MessageProvider, useClass: MockMessageProvider}
//for device/emulator
            , {provide: AccountProvider, useClass: ExtraInfoProvider}
            , {
                provide: Http,
                useFactory: (backend: XHRBackend, options: RequestOptions, extraInfoProvider: ExtraInfoProvider) => {
                  return new InterceptedHttp(backend, options, extraInfoProvider);
                },
                deps: [XHRBackend, RequestOptions, ExtraInfoProvider]
              }
            , {provide: MessageProvider, useClass: UmdMessageProvider},
    DbProvider
            ]
})
export class AppModule {}
