import { ComponentsModule } from './../components/components.module';
import { PlayerSearchPageModule } from './../pages/player-search/player-search.module';
import { PlayersService } from './../services/players';
import { ReportsService } from './../services/reports';
import { PlayerPageModule } from './../pages/player/player.module';
import { EditGamePageModule } from './../pages/edit-game/edit-game.module';
import { GamePageModule } from './../pages/game/game.module';
import { EditReportPageModule } from './../pages/edit-report/edit-report.module';
import { MyReportsPage } from './../pages/my-reports/my-reports';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { MyReportsPageModule } from '../pages/my-reports/my-reports.module';
import { ReportPageModule } from '../pages/report/report.module';
import { ReportsPageModule } from '../pages/reports/reports.module';
import { ReportPage } from '../pages/report/report';
import { EditReportPage } from '../pages/edit-report/edit-report';
import { ReportsPage } from '../pages/reports/reports';
import { EditGamePage } from '../pages/edit-game/edit-game';
import { GamePage } from '../pages/game/game';
import { PlayerPage } from '../pages/player/player';
import { MyReportService } from '../services/my-report';
import { PlayerSearchPage } from '../pages/player-search/player-search';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TabsPageModule,
    MyReportsPageModule,
    ReportPageModule,
    EditReportPageModule,
    ReportsPageModule,
    GamePageModule,
    EditGamePageModule,
    PlayerPageModule,
    PlayerSearchPageModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    MyReportsPage,
    ReportPage,
    EditReportPage,
    ReportsPage,
    GamePage,
    EditGamePage,
    PlayerPage,
    PlayerSearchPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ReportsService,
    PlayersService,
    MyReportService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
