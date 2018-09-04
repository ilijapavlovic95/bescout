import { EditReportPage } from './../edit-report/edit-report';
import { EditGamePage } from './../edit-game/edit-game';
import { SigninPage } from './../signin/signin';
import { Subscription } from 'rxjs/Subscription';
import { ReportsService } from './../../services/reports';
import { AuthService } from './../../services/auth';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Report } from '../../models/report';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit, OnDestroy{

  subscription: Subscription;
  loading: boolean;

  myreports: Report[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthService,
    private reportsService: ReportsService,
    private app: App) {
  }

  ngOnInit(): void {
    this.loading = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  signout() {
    console.log('signoout');
    this.authService.signout()
      .then((value) => {
        const nav = this.app.getRootNav();
        nav.setRoot(SigninPage);
      })
      .catch((err) => console.log(err));
  }

  getMyReports() {
    this.loading = true;
    this.subscription = this.reportsService.getMyReports().subscribe(
      (data) => {
        const arr = this.reportsService.initializeReports(data);
        this.myreports = [];
        for (const r of arr) {
          if (!(r.endDate))
            this.myreports.push(r);
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  goToEditGame() {
    this.navCtrl.push(EditGamePage);
  }

  goToEditReport() {
    this.navCtrl.push(EditReportPage, {mode: 'New'});
  }

  getMyInProgressReports() {
    let arr = [];
    for (const report of this.myreports) {
      if (!report.endDate)
        arr.push(report);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
