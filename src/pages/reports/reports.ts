import { AuthService } from './../../services/auth';
import { ReportPage } from './../report/report';
import { ReportsService } from './../../services/reports';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { Report } from '../../models/report';
import { SigninPage } from '../signin/signin';

/**
 * Generated class for the ReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage implements OnInit, OnDestroy{

  subscription: Subscription;
  filterVisible: boolean;

  filterForm: FormGroup;
  positions = ['No Filter','GK','CB','RB','LB','DM','CM','AMC','AML','AMR','ST'];
  noReportsMessageVisible = false;
  reports: Report[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private reportsService: ReportsService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private app: App) {
  }

  ngOnInit(): void {
    this.filterVisible = true;
    this.filterForm = new FormGroup({
      name: new FormControl(null),
      position: new FormControl('No Filter'),
      minAge: new FormControl(null),
      maxAge: new FormControl(null),
      minGames: new FormControl(null)
    });
  }

  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

  clearFilter() {
    this.filterForm = new FormGroup({
      name: new FormControl(null),
      position: new FormControl('No Filter'),
      minAge: new FormControl(null),
      maxAge: new FormControl(null),
      minGames: new FormControl(null)
    });
  }

  searchReports() {
    const value = this.filterForm.value;
    const filter = {
      name: value.name,
      position: value.position,
      minAge: value.minAge,
      maxAge: value.maxAge,
      minGames: value.minGames
    };
    const loading = this.loadingCtrl.create({
      content: 'Searching...'
    });
    loading.present();
    this.subscription = this.reportsService.getCommunityReports(filter).subscribe(
      (data) => {
        this.filterVisible = false;
        this.reports = this.reportsService.initializeReports(data);
        this.reports = this.reports.sort((a,b) => {
          return b.games.length - a.games.length;
        });
        if (this.reports.length === 0)
          this.noReportsMessageVisible = true;
        else
          this.noReportsMessageVisible = false;
        loading.dismiss();
      },
      (err) => {
        console.log(err)
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportsPage');
  }

  showReport(report, mode: string) {
    if (mode === 'view')
      this.navCtrl.push(ReportPage, { report: report });
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

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
