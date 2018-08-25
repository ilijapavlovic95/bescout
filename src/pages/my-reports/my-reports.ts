import { ReportPage } from './../report/report';
import { Game } from './../../models/game';
import { Report } from './../../models/report';
import { ReportsService } from './../../services/reports';
import { Subscription } from 'rxjs/Subscription';
import { EditReportPage } from './../edit-report/edit-report';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MyReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-reports',
  templateUrl: 'my-reports.html',
})
export class MyReportsPage implements OnInit, OnDestroy {

  subscription: Subscription;
  editReportPage = EditReportPage;

  myReports: Report[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private reportsService: ReportsService) {
  }

  ngOnInit(): void {
    this.subscription = this.reportsService.getMyReports().subscribe(
      data => {
        this.initializeReports(data);
      },
      err => console.log(err)
    );
  }

  initializeReports(data: any) {
    console.log(data.reports);
    this.myReports = [];
    const dbReports = data.reports;
    for (const report of dbReports) {
      let skills = [];
      for (const dbSkill of report.skills) {
        let skill = { title: dbSkill.skill, value: dbSkill.value };
        this.reportsService.generateStarsArray(skill);
        skills.push(skill);
      }

      let games: Game[] = [];
      for (const dbGame of report.games) {
        let min = 90;
        if (dbGame.minutes)
          min = dbGame.minutes;
        const game = new Game(dbGame._id, dbGame.opponent, dbGame.competition, new Date(dbGame.date), dbGame.rating, min, dbGame.effect);
        games.push(game);
      }

      let endDate = null;
      if (report.endDate)
        endDate = new Date(report.endDate);
      this.myReports.push(new Report(report._id, new Date(report.startDate), endDate, report.player, skills, games, report.rating));
    }
    console.log(this.myReports);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyReportsPage');
  }

  showReport(report, mode: string) {
    if (mode === 'view')
      this.navCtrl.push(ReportPage, { report: report });
    else
      this.navCtrl.push(EditReportPage, { report: report, mode: 'Edit' });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
