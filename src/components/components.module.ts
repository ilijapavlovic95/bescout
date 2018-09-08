import { PlayerDetailsComponent } from './player-details/player-details';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { PlayerInfoComponent } from './player-info/player-info';
import { ReportDetailsComponent } from './report-details/report-details';
import { CommunityReportComponent } from './community-report/community-report';

@NgModule({
	declarations: [
		PlayerInfoComponent,
		ReportDetailsComponent,
		PlayerDetailsComponent,
    CommunityReportComponent
	],
	imports: [IonicModule],
	exports: [
		PlayerInfoComponent,
		ReportDetailsComponent,
		PlayerDetailsComponent,
    CommunityReportComponent
	]
})
export class ComponentsModule { }
