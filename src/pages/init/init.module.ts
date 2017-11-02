import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InitPage } from './init';

@NgModule({
  declarations: [
    InitPage,
  ],
  imports: [
    IonicPageModule.forChild(InitPage)
  ],
  exports: [
    InitPage
  ]
})
export class InitPageModule {}
