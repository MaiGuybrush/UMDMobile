import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReleaseNotePage } from './release-note';

@NgModule({
  declarations: [
    ReleaseNotePage,
  ],
  imports: [
    IonicPageModule.forChild(ReleaseNotePage),
  ],
})
export class ReleaseNotePageModule {}
