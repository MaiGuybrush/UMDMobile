import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategorizedMessagesPage } from './categorized-messages';
import { MessageCategoryComponentModule } from '../../components/message-category/message-category.module';

@NgModule({
  declarations: [
    CategorizedMessagesPage,
  ],
  imports: [
    IonicPageModule.forChild(CategorizedMessagesPage),
    MessageCategoryComponentModule
  ],
  exports: [
    CategorizedMessagesPage
  ]
})
export class CategorizedMessagesPageModule {}
