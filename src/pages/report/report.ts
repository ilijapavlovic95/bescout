import { GamePage } from './../game/game';
import { Report } from './../../models/report';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ReportsService } from '../../services/reports';
import { Chart } from 'chart.js';

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage implements OnInit {

  selectedStat: any;
  noGames: boolean;
  gamesVisible: boolean = false;

  @ViewChild('pieCanvas') pieCanvas;
  pieChart: any;

  report: Report;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private reportsService: ReportsService,
    private modalCtrl: ModalController) {

  }

  ngOnInit(): void {
    this.report = this.navParams.data.report;
    if (this.report.games.length === 0)
      this.noGames = true;
    else
      this.noGames = false;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
  }

  getAverageRating() {
    let sum = 0;
    for (const game of this.report.games) {
      sum += game.rating;
    }
    return sum / this.report.games.length;
  }

  generateBasicStatsValues() {
    return this.reportsService.generateBasicStatsValues(this.report);
  }

  generateSpecificStats() {
    let specStatsArr = [];
    let counter = 0;
    for (const game of this.report.games) {
      const statArr = this.reportsService.generateSpecificStats(game);
      for (const stat of statArr) {
        if (counter === 0)
          specStatsArr.push({
            title: stat.title,
            positiveValue: stat.positive.value,
            negativeValue: stat.negative.value
          });
        else {
          for (const specStat of specStatsArr) {
            if (stat.title === specStat.title) {
              specStat.positiveValue += stat.positive.value;
              specStat.negativeValue += stat.negative.value;
              break;
            }
          }
        }
      }
      counter++;
    }
    return specStatsArr;
  }

  createPieChart() {
    console.log(this.selectedStat);
    this.pieChart = null;
    this.pieCanvas.innerHTML = '';
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.reportsService.generateLabelsForPieChart(this.selectedStat),
        datasets: [{
          label: this.selectedStat.title,
          data: [this.selectedStat.positiveValue, this.selectedStat.negativeValue],
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

  toggleGames() {
    this.gamesVisible = !this.gamesVisible;
  }

  showGameStats(game) {
    const modal = this.modalCtrl.create(GamePage, {game: game});
    modal.present();
  }

}
