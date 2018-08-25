import { Game } from './../models/game';
import { Api } from './../constants/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report } from '../models/report';

@Injectable()
export class ReportsService {

  starsArray = [
    ['star_border', 'star_border', 'star_border', 'star_border', 'star_border'],
    ['star_half', 'star_border', 'star_border', 'star_border', 'star_border'],
    ['star', 'star_border', 'star_border', 'star_border', 'star_border'],
    ['star', 'star_half', 'star_border', 'star_border', 'star_border'],
    ['star', 'star', 'star_border', 'star_border', 'star_border'],
    ['star', 'star', 'star_half', 'star_border', 'star_border'],
    ['star', 'star', 'star', 'star_border', 'star_border'],
    ['star', 'star', 'star', 'star_half', 'star_border'],
    ['star', 'star', 'star', 'star', 'star_border'],
    ['star', 'star', 'star', 'star', 'star_half'],
    ['star', 'star', 'star', 'star', 'star'],
  ];

  private myReports: Report[] = [];

  constructor(private http: HttpClient) { }

  setMyReports(reports: Report[]): void {
    this.myReports = reports;
  }

  getMyReports(): any {
    return this.http.get(Api.URI + 'reports');
  }

  generateStarsArray(skill) {
    skill.starsArray = this.starsArray[skill.value];
  }

  generateSpecificStats(game) {
    let arr = [];

    for (const stat of game.effect) {
      if (stat.specificStat && !this.isAdded(stat, arr)) {
        const title = stat.statistics.split('_')[0];
        let positive = null;
        let negative = null;
        if (stat.statistics.split('_')[1] === 'positive') {
          positive = stat;
          for (const negStat of game.effect) {
            if (negStat.statistics === (title + '_negative'))
              negative = negStat;
          }
        } else {
          negative = stat;
          for (const posStat of game.effect) {
            if (posStat.statistics === (title + '_positive'))
              positive = posStat;
          }
        }
        arr.push({
          title: title,
          positive: positive,
          negative: negative
        })
      }
    }

    return arr;
  }

  isAdded(stat, arr: any[]): boolean {
    for (const el of arr) {
      const title = stat.statistics.split('_')[0];
      if (el.title === title)
        return true;
    }
    return false;
  }

  generateBasicStatsValues(obj: any) {
    let statNames = ['GP', 'MPG', 'G', 'A', 'AR'];

    // obj moze biti Report ili Game
    // ako ne postoji report.games onda znaci da je u pitanju game
    if (!obj.games) {
      const game: Game = obj;
      return [
        { title: statNames[0], value: 1 },
        { title: statNames[1], value: game.minutes.toFixed(2) },
        {
          title: statNames[2], value: (game.effect.find((stat) => {
            return stat.statistics === 'goals'
          })).value
        },
        {
          title: statNames[3], value: (game.effect.find((stat) => {
            return stat.statistics === 'assists'
          })).value
        },
        { title: statNames[4], value: game.rating.toFixed(2) }
      ];
    }

    const report: Report = obj;
    let games = 0;
    let sumMinutes = 0;
    let goals = 0;
    let assists = 0;
    let sumRating = 0
    for (const game of report.games) {
      for (const stat of game.effect) {
        if (stat.statistics === 'goals') goals += stat.value;
        if (stat.statistics === 'assists') assists += stat.value;
      }
      sumMinutes += game.minutes;
      sumRating += game.rating;
      games++;
    }

    return [
      { title: statNames[0], value: games },
      { title: statNames[1], value: (sumMinutes / games).toFixed(2) || 0 },
      { title: statNames[2], value: goals },
      { title: statNames[3], value: assists },
      { title: statNames[4], value: (sumRating / games).toFixed(2) || 0 }
    ];
  }

  generateLabelsForPieChart(selectedStat: any): string[] {
    if (selectedStat.title === 'passes') return ['Successfull', 'Unsuccessfull'];
    if (selectedStat.title === 'shots') return ['On Target', 'Off Target'];
    if (selectedStat.title === 'dribbles') return ['Successfull', 'Unsuccessfull'];
    if (selectedStat.title === 'aerial duels') return ['Successfull', 'Unsuccessfull'];
    if (selectedStat.title === 'crosses') return ['Successfull', 'Unsuccessfull'];
  }

}