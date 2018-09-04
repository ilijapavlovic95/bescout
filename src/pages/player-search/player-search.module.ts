import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerSearchPage } from './player-search';

@NgModule({
  declarations: [
    PlayerSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerSearchPage),
    ComponentsModule
  ],
})
export class PlayerSearchPageModule {}
