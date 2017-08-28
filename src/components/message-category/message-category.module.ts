import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageCategoryComponent } from './message-category.component';

@NgModule({
  declarations: [
    MessageCategoryComponent
  ],
  imports: [
    IonicPageModule.forChild(MessageCategoryComponent),
  ],
  exports: [
    MessageCategoryComponent
  ]
})
export class MessageCategoryComponentModule {}
