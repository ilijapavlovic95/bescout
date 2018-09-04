import { SigninPage } from './../signin/signin';
import { AuthService } from './../../services/auth';
import { ReportPage } from './../report/report';
import { Game } from './../../models/game';
import { Report } from './../../models/report';
import { ReportsService } from './../../services/reports';
import { Subscription } from 'rxjs/Subscription';
import { EditReportPage } from './../edit-report/edit-report';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
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
    private reportsService: ReportsService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private app: App) {
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
    this.myReports = this.reportsService.initializeReports(data);
    this.myReports = this.myReports.sort((a,b) => {
      if (a.startDate < b.startDate)
        return 1;
      return -1;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyReportsPage');
  }

  ionViewWillEnter() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait ...'
    });
    loading.present();
    this.subscription = this.reportsService.getMyReports().subscribe(
      data => {
        loading.dismiss();
        this.initializeReports(data);
      },
      err => console.log(err)
    );
  }

  showReport(report, mode: string) {
    if (mode === 'view')
      this.navCtrl.push(ReportPage, { report: report });
    else
      this.navCtrl.push(EditReportPage, { report: report, mode: 'Edit' });
  }

  // TODO dodati ovo na svaku stranicu gde ima signout
  signout() {
    console.log('signoout');
    this.authService.signout()
      .then((value) => {
        const nav = this.app.getRootNav();
        nav.setRoot(SigninPage);
      })
      .catch((err) => console.log(err));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
