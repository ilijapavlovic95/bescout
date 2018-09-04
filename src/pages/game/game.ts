import { DateFormatPipe } from './../../pipes/date-format/date-format';
import { Chart } from 'chart.js';
import { ReportsService } from './../../services/reports';
import { Game } from './../../models/game';
import { Stat } from './../../models/stat';
import { MyReportService } from './../../services/my-report';
import { Report } from './../../models/report';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage implements OnInit, OnDestroy {

  selectedStat: any;
  noDataMessageVisible: boolean = false;

  @ViewChild('pieCanvas') pieCanvas;
  pieChart: any;

  report: Report;
  game: Game;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private myreportService: MyReportService,
    private reportsService: ReportsService,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController) {
  }

  ngOnInit(): void {
    this.game = this.navParams.get('game');
    this.report = this.navParams.get('report');
    console.log(this.game);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');
  }

  generateBasicStatsValues() {
    return this.reportsService.generateBasicStatsValues(this.game, this.report.player.position);
  }

  createPieChart() {
    console.log(this.selectedStat);
    if (this.selectedStat.positive.value === 0 && this.selectedStat.negative.value === 0) {
      this.noDataMessageVisible = true;
      return;
    }
    this.noDataMessageVisible = false;
    this.pieChart = null;
    this.pieCanvas.innerHTML = '';
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.reportsService.generateLabelsForPieChart(this.selectedStat),
        datasets: [{
          label: this.selectedStat.title,
          data: [this.selectedStat.positive.value, this.selectedStat.negative.value],
          backgroundColor: [
            'rgba(23, 105, 87, 0.8)',
            'rgba(253, 203, 110, 0.8)'
          ],
          hoverBackgroundColor: [
            "#176957",
            "#fdcb6e"
          ]
        }]
      }

    });
  }

  generateSpecificStats() {
    return this.reportsService.generateSpecificStats(this.game);
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

  ngOnDestroy(): void {
  }

}
