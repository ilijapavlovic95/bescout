import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameReminderPage } from './game-reminder';

@NgModule({
  declarations: [
    GameReminderPage,
  ],
  imports: [
    IonicPageModule.forChild(GameReminderPage),
  ],
})
export class GameReminderPageModule {}
