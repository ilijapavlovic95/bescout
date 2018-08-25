import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { PlayerInfoComponent } from './player-info/player-info';
@NgModule({
	declarations: [PlayerInfoComponent],
	imports: [IonicModule],
	exports: [PlayerInfoComponent]
})
export class ComponentsModule {}
