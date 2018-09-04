import { PlayerDetailsComponent } from './player-details/player-details';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { PlayerInfoComponent } from './player-info/player-info';
import { ReportDetailsComponent } from './report-details/report-details';

@NgModule({
	declarations: [
		PlayerInfoComponent,
		ReportDetailsComponent,
		PlayerDetailsComponent
	],
	imports: [IonicModule],
	exports: [
		PlayerInfoComponent,
		ReportDetailsComponent,
		PlayerDetailsComponent
	]
})
export class ComponentsModule { }
