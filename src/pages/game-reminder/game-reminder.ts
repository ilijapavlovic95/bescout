import { Calendar } from '@ionic-native/calendar';
import { CalendarService } from './../../services/calendar';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, Events, Platform } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Report } from '../../models/report';
import * as moment from 'moment';

/**
 * Generated class for the GameReminderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game-reminder',
  templateUrl: 'game-reminder.html',
})
export class GameReminderPage implements OnInit, OnDestroy {

  report: Report;
  gameForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private calendar: Calendar,
    private platform: Platform) {
    this.platform.ready().then(() => console.log('Platform is ready for calendar.'));
  }

  ngOnInit(): void {
    this.report = this.navParams.get('report');
    this.gameForm = new FormGroup({
      opponent: new FormControl(null, Validators.required),
      competition: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      time: new FormControl(null, Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameReminderPage');

  }

  goBack() {
    this.viewCtrl.dismiss();
  }

  generateMinDate() {
    return (new Date().getFullYear());
  }

  generateMaxDate() {
    return (new Date().getFullYear() + 1);
  }

  createReminder() {
    if (this.gameForm.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Invalid Input',
        subTitle: 'You have to set game info to create reminder.',
        buttons: ['OK']
      });
      alert.present();
    } else {
      const values = this.gameForm.value;
      let gameInfo: any = {};
      gameInfo.player = this.report.player.name;
      gameInfo.opponent = values.opponent;
      gameInfo.competition = values.competition;
      gameInfo.date = moment(values.date + ' ' + values.time, 'DD.MM.YYYY. HH:mm');
      console.log(gameInfo);
      this.addEvent(gameInfo);

    }
  }

  addEvent(gameInfo: any) {
    console.log(gameInfo);
    debugger;
    const title = 'Game reminder: ' + gameInfo.player;
    const notes = 'vs ' + gameInfo.opponent + ', ' + gameInfo.competition;
    const startDate: Date = gameInfo.date.toDate();
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
      startDate.getHours() + 2, startDate.getMinutes(), startDate.getSeconds());
    console.log('startDate', startDate);
    console.log('endDate', endDate);
    // this.calendar.createEvent('Moj Komšija događaj', this.event.locationName, '', new Date(this.event.dateFrom), new Date(this.event.dateTo)).then(
    //   () => {
    //     this.toast.presentToast('Događaj je uspešno sačuvan u kalendaru telefona.')
    //   }, () => {
    //     this.createCalendarAlert('Greška', 'Došlo je do greške prilikom čuvanja događaja. Proverite da li aplikacija ima dozvoljen pristup kalendaru i pokušajte ponovo.');
    //   });

    this.calendar.createEvent(title, '', notes, startDate, endDate)
      .then(
        () => {
          console.log('event created');
          this.showToast();
        },
        () => console.log('Error occured on creating event.')
      );
  }

  showToast() {
    let toast = this.toastCtrl.create({
      message: 'Reminder added.',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
    toast.onDidDismiss(() => {
      this.navCtrl.pop();
    });
  }

  ngOnDestroy(): void {
  }

}
