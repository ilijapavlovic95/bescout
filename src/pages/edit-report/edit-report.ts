import { EditGamePage } from './../edit-game/edit-game';
import { ReportsService } from './../../services/reports';
import { GamePage } from './../game/game';
import { Report } from './../../models/report';
import { Skill } from './../../models/skill';
import { PlayerSearchPage } from './../player-search/player-search';
import { MyReportService } from './../../services/my-report';
import { PlayersService } from './../../services/players';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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
    private modalCtrl: ModalController) {
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
      this.report = new Report(null, null, null, null, [], [], 0);

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
    skill.value--;
    this.reportsService.generateStarsArray(skill);
  }

  increaseSkillValue(skill) {
    skill.value++;
    this.reportsService.generateStarsArray(skill);
  }

  startScouting() {
    // saving report to db
    this.subscriptionReport = this.myreportService.saveReport(this.report).subscribe(
      data => {
        const report = data['report'];
        this.report._id = report._id;
      },
      err => console.log(err)
    );
  }

  addGame() {
    this.navCtrl.push(EditGamePage, { report: this.report });
  }

  updateReport() {
    this.subscriptionUpdateReport = this.myreportService.updateReport(this.report).subscribe(
      (data) => console.log(data),
      (err) => console.log(err)
    );
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionReport)
      this.subscriptionReport.unsubscribe();
    if (this.subscriptionUpdateReport)
      this.subscriptionUpdateReport.unsubscribe();
  }

}
