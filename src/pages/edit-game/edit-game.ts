import { ReportsService } from './../../services/reports';
import { Game } from './../../models/game';
import { Stat } from './../../models/stat';
import { MyReportService } from './../../services/my-report';
import { Report } from './../../models/report';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/**
 * Generated class for the EditGamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-game',
  templateUrl: 'edit-game.html',
})
export class EditGamePage {

  subscription: Subscription;
  subscriptionGame: Subscription;
  subscriptionGetMyReports: Subscription;
  gameForm: FormGroup;
  gameFormVisible: boolean;
  specificStats = [];

  myActiveReports: Report[];

  report: Report;
  game: Game;
  rating: number;
  minutes: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private myreportService: MyReportService,
    private reportsService: ReportsService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
  }

  ngOnInit(): void {
    if (this.navParams.data.report) {
      this.report = this.navParams.data.report;
      this.initialize();
    } else {
      const loading = this.loadingCtrl.create({
        content: 'Please wait ...'
      });
      this.subscriptionGetMyReports = this.reportsService.getMyReports().subscribe(
        (data) => {
          const arr = this.reportsService.initializeReports(data);
          this.myActiveReports = [];
          for (const r of arr) {
            if (!(r.endDate))
              this.myActiveReports.push(r);
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          console.log(err);
        }
      );
    }


  }

  initialize() {
    this.initializeGame();
    this.initializeStats();
    this.rating = 70;
    this.minutes = 0;
    this.gameFormVisible = true;
    this.gameForm = new FormGroup({
      opponent: new FormControl(null, Validators.required),
      competition: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required)
    });
  }

  initializeGame() {
    this.game = new Game(null, null, null, null, 0, 0, []);
  }

  initializeStats() {
    this.subscription = this.myreportService.getStats(this.report.player.position.toLowerCase())
      .subscribe(
        data => {
          const stats = data.stats;
          for (const stat of stats) {
            let specific = true;
            if (stat.position.length >= 9 && !stat.title.startsWith('passes'))
              specific = false;
            // u slucaju da se radi o golmanu
            if (stat.title === 'saves' || stat.title === 'saved penalties' || stat.title === 'goals against')
              specific = false;

            this.game.effect.push({
              statistics: stat.title,
              value: 0,
              specificStat: specific
            });
          }
          console.log(this.game);
        },
        err => console.log(err)
      );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');
  }

  toggleGameForm() {
    if (!this.gameFormVisible) {
      this.gameFormVisible = true;
      return;
    }

    if (this.gameForm.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Game info is required.',
        buttons: ['OK']
      });
      alert.present();
    } else {
      const date: Date = new Date(this.gameForm.value.date);
      this.game.opponent = this.gameForm.value.opponent;
      this.game.competition = this.gameForm.value.competition;
      this.game.date = date;
      this.gameFormVisible = false;
    }
  }

  generateStatsForView(row: number) {
    const position = this.report.player.position;
    if (row === 1) {
      if (position.toLowerCase() !== 'gk')
        return this.generateStats(['goals', 'assists', 'key passes']);
      else
        return this.generateStats(['goals against', 'saves']);
    }

    if (row === 2) {
      if (position.toLowerCase() !== 'gk')
        return this.generateStats(['yellow cards', 'red cards', 'own goals', 'missed penalties']);
      else
        return this.generateStats(['yellow cards', 'red cards', 'own goals', 'saved penalties']);
    }
  }

  generateStats(statNames: string[]) {
    let arr = [];
    for (let statName of statNames) {
      for (const stat of this.game.effect) {
        if (stat.statistics === statName)
          arr.push(stat);
      }
    }
    return arr;
  }

  generateSpecificStats() {
    return this.reportsService.generateSpecificStats(this.game);
  }

  increaseEffectValue(effect) {
    effect.value++;
    console.log(this.game);
  }

  getShortEffectTitle(title: string): string {

    if (title === 'yellow cards') return 'YC';
    if (title === 'red cards') return 'RC';
    if (title === 'own goals') return 'OwnG';
    if (title === 'missed penalties') return 'PenM';
    if (title === 'saved penalties') return 'PenSaved';
    if (title == 'passes_positive') return 'Successful';
    if (title == 'passes_negative') return 'Unsuccessful';

    return title;
  }

  saveGame() {
    if (this.gameForm.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'You have to set game info at least.',
        buttons: ['OK']
      });
      alert.present();
    } else {
      const date: Date = new Date(this.gameForm.value.date);
      this.game.opponent = this.gameForm.value.opponent;
      this.game.competition = this.gameForm.value.competition;
      this.game.date = date;
      this.game.rating = this.rating / 10;
      this.game.minutes = this.minutes;
      this.report.games.push(this.game);
      console.log(this.report);
      const loading = this.loadingCtrl.create({
        content: 'Saving game...'
      });
      loading.present();
      this.subscriptionGame = this.myreportService.saveGame(this.report, this.game)
        .subscribe(
          data => {
            console.log(data);
            loading.dismiss();
            this.navCtrl.pop();
          },
          err => console.log(err)
        );
    }

  }

  goBack() {
    this.navCtrl.popToRoot();
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionGame)
      this.subscriptionGame.unsubscribe();
    if (this.subscriptionGetMyReports)
      this.subscriptionGetMyReports.unsubscribe();
  }

}
