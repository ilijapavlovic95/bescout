import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerSearchPage } from './player-search';

@NgModule({
  declarations: [
    PlayerSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerSearchPage),
  ],
})
export class PlayerSearchPageModule {}
