import { CallBroker } from './callBroker';
import { AuthService } from './auth';
import { Game } from './../models/game';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report } from '../models/report';

@Injectable()
export class ReportsService {

  starsArray = [
    ['star-outline', 'star-outline', 'star-outline', 'star-outline', 'star-outline'],
    ['star-half', 'star-outline', 'star-outline', 'star-outline', 'star-outline'],
    ['star', 'star-outline', 'star-outline', 'star-outline', 'star-outline'],
    ['star', 'star-half', 'star-outline', 'star-outline', 'star-outline'],
    ['star', 'star', 'star-outline', 'star-outline', 'star-outline'],
    ['star', 'star', 'star-half', 'star-outline', 'star-outline'],
    ['star', 'star', 'star', 'star-outline', 'star-outline'],
    ['star', 'star', 'star', 'star-half', 'star-outline'],
    ['star', 'star', 'star', 'star', 'star-outline'],
    ['star', 'star', 'star', 'star', 'star-half'],
    ['star', 'star', 'star', 'star', 'star'],
  ];

  private myReports: Report[] = [];

  constructor(private callBroker: CallBroker) { }

  setMyReports(reports: Report[]): void {
    this.myReports = reports;
  }

  getMyReports(): any {
    return this.callBroker.getMyReports();
  }

  addMyReport(report) {
    this.myReports.push(report);
  }

  getCommunityReports(filter: any): any {
    let query = '';
    if (filter.name) query += `?name=${filter.name}`;
    if (filter.position && filter.position.toLowerCase() !== 'no filter') {
      if (query === '') query += `?position=${filter.position}`;
      else query += `&position=${filter.position}`;
    }
    if (filter.minAge) {
      if (query === '') query += `?minAge=${filter.minAge}`;
      else query += `&minAge=${filter.minAge}`;
    }
    if (filter.maxAge) {
      if (query === '') query += `?maxAge=${filter.maxAge}`;
      else query += `&maxAge=${filter.maxAge}`;
    }
    if (filter.minGames) {
      if (query === '') query += `?minGames=${filter.minGames}`;
      else query += `&minGames=${filter.minGames}`;
    }

    return this.callBroker.getCommunityReports(query);
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

  generateBasicStatsValues(obj: any, position: string) {
    if (position.toLowerCase() === 'gk')
      return this.generateBasicStatsValuesForGK(obj);

    let statNames = ['GP', 'MPG', 'G', 'A', 'AR'];

    // obj moze biti Report ili Game
    // ako ne postoji report.games onda znaci da je u pitanju game
    if (!obj.games) {
      statNames = ['GP', 'MIN', 'G', 'A', 'R'];
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
      { title: statNames[1], value: ((sumMinutes / games) || 0).toFixed(2) },
      { title: statNames[2], value: goals },
      { title: statNames[3], value: assists },
      { title: statNames[4], value: ((sumRating / games) || 0).toFixed(2) }
    ];
  }

  generateBasicStatsValuesForGK(obj) {
    let statNames = ['GP', 'MPG', 'CS', 'SPG', 'AR'];

    // obj moze biti Report ili Game
    // ako ne postoji report.games onda znaci da je u pitanju game
    if (!obj.games) {
      statNames = ['GP', 'MIN', 'CS', 'S', 'R'];
      const game: Game = obj;
      return [
        { title: statNames[0], value: 1 },
        { title: statNames[1], value: game.minutes.toFixed(2) },
        {
          title: statNames[2], value: (game.effect.find((stat) => {
            return stat.statistics === 'goals against'
          })).value > 0 ? 0 : 1
        },
        {
          title: statNames[3], value: (game.effect.find((stat) => {
            return stat.statistics === 'saves'
          })).value
        },
        { title: statNames[4], value: game.rating.toFixed(2) }
      ];
    }

    const report: Report = obj;
    let games = 0;
    let sumMinutes = 0;
    let cleanSheets = 0;
    let sumSaves = 0;
    let sumRating = 0
    for (const game of report.games) {
      for (const stat of game.effect) {
        if (stat.statistics === 'goals against' && stat.value === 0) cleanSheets++;
        if (stat.statistics === 'saves') sumSaves += stat.value;
      }
      sumMinutes += game.minutes;
      sumRating += game.rating;
      games++;
    }

    return [
      { title: statNames[0], value: games },
      { title: statNames[1], value: ((sumMinutes / games) || 0).toFixed(2) },
      { title: statNames[2], value: cleanSheets },
      { title: statNames[3], value: ((sumSaves / games) || 0).toFixed(2) },
      { title: statNames[4], value: ((sumRating / games) || 0).toFixed(2) }
    ];
  }

  generateLabelsForPieChart(selectedStat: any): string[] {
    if (selectedStat.title === 'shots') return ['% On Target', '% Off Target'];

    return ['% Successful', '% Unsucessful'];
  }

  initializeReports(data) {
    console.log(data.reports);
    this.myReports = [];
    const dbReports = data.reports;
    for (const report of dbReports) {
      let skills = [];
      for (const dbSkill of report.skills) {
        let skill = { title: dbSkill.skill, value: dbSkill.value };
        this.generateStarsArray(skill);
        skills.push(skill);
      }

      let games: Game[] = [];
      for (const dbGame of report.games) {
        let min = 90;
        if (dbGame.minutes)
          min = dbGame.minutes;
        const game = new Game(dbGame._id, dbGame.opponent, dbGame.competition, new Date(dbGame.date), dbGame.rating, min, dbGame.effect);
        games.push(game);
      }

      let endDate = null;
      if (report.endDate)
        endDate = new Date(report.endDate);

      let likes = []
      if (report.likes)
        likes = report.likes;

      let dislikes = []
      if (report.dislikes)
        dislikes = report.dislikes;

      let r = new Report(report._id, new Date(report.startDate), endDate, report.player, skills, games, likes, dislikes);

      if (report.userId)
        r.user = report.userId.fullname;

      this.myReports.push(r);
    }
    console.log(this.myReports);
    return this.myReports;
  }

  rateReport(rateType: string, mode: string, report: Report) {
    return this.callBroker.rateReport({ type: rateType, mode: mode }, report._id);
  }

}