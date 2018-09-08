import { AuthService } from './../../services/auth';
import { SigninPage } from './../signin/signin';
import { GameReminderPage } from './../game-reminder/game-reminder';
import { EditGamePage } from './../edit-game/edit-game';
import { ReportsService } from './../../services/reports';
import { GamePage } from './../game/game';
import { Report } from './../../models/report';
import { Skill } from './../../models/skill';
import { PlayerSearchPage } from './../player-search/player-search';
import { MyReportService } from './../../services/my-report';
import { PlayersService } from './../../services/players';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, App } from 'ionic-angular';
import { Player } from '../../models/player';
import { FormControl } from '@angular/forms';
import { PlayerPage } from '../player/player';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the EditReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-report',
  templateUrl: 'edit-report.html',
})
export class EditReportPage implements OnInit, OnDestroy {

  subscription: Subscription;
  subscriptionReport: Subscription;
  subscriptionUpdateReport: Subscription;
  subscriptionEndReport: Subscription;

  playerPage = PlayerPage;
  mode: string = 'new';
  searchValue: FormControl = new FormControl();
  skills: Skill[];

  players: Player[];
  report: Report;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private playersService: PlayersService,
    private myreportService: MyReportService,
    private reportsService: ReportsService,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private app: App) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.data.mode;
    this.initializeReport();

    //this.playersService.setPlayers([new Player('1', 'Eriksen', 'AMC', 'Tottenham', 'Denmark', 28, 'default'), new Player('2', 'Kane', 'ST', 'Tottenham', 'England', 24, 'default')])
    this.initializePlayers();
  }

  initializePlayers() {
    this.players = this.playersService.getPlayers();
  }

  initializeReport() {
    if (this.mode === 'Edit')
      this.report = this.navParams.data.report;
    else
      this.report = new Report(null, null, null, null, [], [], [], []);

    this.myreportService.setReport(this.report);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditReportPage');
  }

  openPlayerSearchModal(): void {
    const modal = this.modalCtrl.create(PlayerSearchPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.initializeReport();
        this.report.player = data.selectedPlayer;
        this.initializeSkills();
      }
    });
    modal.present();
  }

  openNewPlayerModal() {
    const modal = this.modalCtrl.create(PlayerPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.initializeReport();
        this.report.player = data.selectedPlayer;
        this.initializeSkills();
      }
    });
    modal.present();
  }

  initializeSkills() {
    this.subscription = this.playersService.getSkills(this.report.player.position.toLowerCase())
      .subscribe(
        data => {
          const arr: any[] = data.skills;
          for (const skill of arr) {
            let skillWithStars = {
              title: skill.title,
              value: 0
            };
            this.reportsService.generateStarsArray(skillWithStars);
            this.report.skills.push(skillWithStars);
          }
          console.log(this.report);
        },
        error => console.log(error)
      );
  }

  showSelectionDiv() {
    this.report.player = null;
  }

  decreaseSkillValue(skill) {
    if (skill.value === 0)
      return;
    skill.value--;
    this.reportsService.generateStarsArray(skill);
  }

  increaseSkillValue(skill) {
    if (skill.value === 10)
      return;
    skill.value++;
    this.reportsService.generateStarsArray(skill);
  }

  startScouting() {
    const loading = this.loadingCtrl.create({
      content: 'Saving ...'
    });
    loading.present();
    // saving report to db
    this.subscriptionReport = this.myreportService.saveReport(this.report).subscribe(
      data => {
        const report = data['report'];
        this.report._id = report._id;
        this.reportsService.addMyReport(this.report);
        loading.dismiss();
      },
      err => console.log(err)
    );
  }

  addGame() {
    this.navCtrl.push(EditGamePage, { report: this.report });
  }

  updateReport() {
    const loading = this.loadingCtrl.create({
      content: 'Updating ...'
    });
    loading.present();
    this.subscriptionUpdateReport = this.myreportService.updateReport(this.report).subscribe(
      (data) => {
        console.log(data);
        loading.dismiss();
      },
      (err) => console.log(err)
    );
  }

  openGameReminderModal() {
    const modal = this.modalCtrl.create(GameReminderPage, {report: this.report});
    modal.present();
  }

  endReport() {
    const alert = this.alertCtrl.create({
      title: 'Do you really want to end this report?',
      message: 'This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.endReportInDB();
          }
        }
      ]
    });
    alert.present();
  }

  endReportInDB() {
    this.report.endDate = new Date();
    const loading = this.loadingCtrl.create({
      content: 'Updating...'
    });
    loading.present();
    this.myreportService.updateReport(this.report).subscribe(
      (data: any) => {
        this.report.endDate = data.report.endDate;
        loading.dismiss();
      },
      (err) => console.log(err)
    );
  }

  // signout() {
  //   console.log('signoout');
  //   this.authService.signout()
  //     .then((value) => {
  //       const nav = this.app.getRootNav();
  //       nav.setRoot(SigninPage);
  //     })
  //     .catch((err) => console.log(err));
  // }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionReport)
      this.subscriptionReport.unsubscribe();
    if (this.subscriptionUpdateReport)
      this.subscriptionUpdateReport.unsubscribe();
    if (this.subscriptionEndReport)
      this.subscriptionEndReport.unsubscribe();
  }

}
