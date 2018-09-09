import { Subscription } from 'rxjs/Subscription';
import { SigninPage } from './../signin/signin';
import { AuthService } from './../../services/auth';
import { GamePage } from './../game/game';
import { Report } from './../../models/report';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App } from 'ionic-angular';
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
export class ReportPage implements OnInit, OnDestroy {

  subscriptionLike: Subscription;
  subscriptionDislike: Subscription;

  selectedStat: any;
  noGames: boolean;
  gamesVisible: boolean = false;
  noDataMessageVisible: boolean = false;

  @ViewChild('pieCanvas') pieCanvas;
  pieChart: any;
  @ViewChild('radarCanvas') radarCanvas;
  radarChart: any;

  report: Report;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private reportsService: ReportsService,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private app: App) {

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
    this.initializeRadarChart();
  }

  initializeRadarChart() {
    let attributesTitles = [];
    for (const skill of this.report.skills) {
      attributesTitles.push(skill.title.toUpperCase());
    }

    let attributesValues = [];
    for (const skill of this.report.skills) {
      attributesValues.push(skill.value);
    }

    const attributesData = {
      labels: attributesTitles,
      datasets: [{
        backgroundColor: 'rgba(23, 105, 87, 0.8)',
        hoverBackgroundColor: '#176957',
        data: attributesValues
      }]
    };

    const chartOptions = {
      scale: {
        ticks: {
          beginAtZero: true,
          min: 0,
          max: 10,
          stepSize: 2
        },
        pointLabels: {
          fontSize: 10
        }
      },
      legend: {
        display: false
      }
    };

    this.radarChart = new Chart(this.radarCanvas.nativeElement, {
      type: 'radar',
      data: attributesData,
      options: chartOptions
    });
  }


  getAverageRating() {
    let sum = 0;
    for (const game of this.report.games) {
      sum += game.rating;
    }
    return sum / this.report.games.length;
  }

  generateBasicStatsValues() {
    return this.reportsService.generateBasicStatsValues(this.report, this.report.player.position);
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
    if (this.selectedStat.positiveValue === 0 && this.selectedStat.negativeValue == 0) {
      this.noDataMessageVisible = true;
      return;
    }
    const positiveValue = Number(((this.selectedStat.positiveValue / (this.selectedStat.positiveValue + this.selectedStat.negativeValue))*100).toFixed(2));
    const negativeValue = 100 - positiveValue;
    
    this.noDataMessageVisible = false;
    this.pieChart = null;
    this.pieCanvas.innerHTML = '';
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.reportsService.generateLabelsForPieChart(this.selectedStat),
        datasets: [{
          label: this.selectedStat.title,
          data: [
            positiveValue, 
            negativeValue
          ],
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
    const modal = this.modalCtrl.create(GamePage, { game: game, report: this.report });
    modal.present();
  }

  alreadyLiked() {
    for (const userId of this.report.likes) {
      if (userId === this.authService.getCurrentUser()._id) {
        return true;
      }
    }
    return false;
  }

  alreadyDisliked() {
    for (const userId of this.report.dislikes) {
      if (userId === this.authService.getCurrentUser()._id) {
        return true;
      }
    }
    return false;
  }

  likeReport(mode: string) {
    this.subscriptionLike = this.reportsService.rateReport('like', mode, this.report).subscribe(
        (data: any) => {
          this.report.likes = data.report.likes;
          this.report.dislikes = data.report.dislikes;
        },
        (err) => console.log(err)
      );
  }

  dislikeReport(mode: string) {
    this.subscriptionLike = this.reportsService.rateReport('dislike', mode, this.report).subscribe(
        (data: any) => {
          this.report.dislikes = data.report.dislikes;
          this.report.likes = data.report.likes;
        },
        (err) => console.log(err)
      );
  }

  ngOnDestroy() {
    if (this.subscriptionDislike) {
      this.subscriptionDislike.unsubscribe();
    }
    if (this.subscriptionLike) {
      this.subscriptionLike.unsubscribe();
    }
  }

}
