import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Calendar } from '@ionic-native/calendar';

@Injectable()
export class CalendarService {

  constructor(
    private calendar: Calendar,
    private events: Events
  ) { }

  // gameInfo is local model - {player, opponent, competition, date}
  addReminder(gameInfo: any) {
    this.calendar.hasReadWritePermission().then((result) => {
      if (result === false) {
        this.calendar.requestReadWritePermission().then((v) => {
          this.addEvent(gameInfo);
        }, (r) => {
          console.log("Rejected");
        })
      }
      else {
        this.addEvent(gameInfo);
      }
    });
  }

  addEvent(gameInfo: any) {
    const title = 'Report reminder: ' + gameInfo.player;
    const notes = 'vs' + gameInfo.opponent + ', ' + gameInfo.competition;
    const startDate: Date = gameInfo.date;
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(),
      startDate.getHours() + 2, startDate.getMinutes(), startDate.getSeconds());
    return this.calendar.createEvent(title, null, notes, startDate, endDate);
  }

}