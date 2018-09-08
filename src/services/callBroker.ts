import { UserService } from './userService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from './../globals/api';
import { Injectable } from '@angular/core';

@Injectable()
export class CallBroker {

  constructor(private http: HttpClient, private userService: UserService) { }

  private url = Api.URL;

  private auth = this.url + 'auth';
  private users = this.url + 'users';
  private players = this.url + 'players';
  private reports = this.url + 'reports';
  private stats = this.url + 'stats';
  private skills = this.url + 'skills';

  private meRoute = this.users + '/me';
  private signupRoute = this.users;

  private signinRoute = this.auth;

  private getPlayersRoute = this.players;
  private addPlayerRoute = this.players;
  private updatePlayerRoute = this.players;

  private getReportsRoute = this.reports;
  private getReportsByUserIdRoute = this.reports;
  private addReportRoute = this.reports;
  private updateReportRoute = this.reports;
  private addGameToReportRoute = this.reports + '/games';
  private rateReportRoute = this.reports + '/ratings';

  private getSkillsByPosition = this.skills;

  private getStatsByPosition = this.stats;

  private httpAuthOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': this.userService.getCurrentUser().token
      })
    };
  }

  private httpDefaultOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  private httpResponseOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      // tslint:disable-next-line:quotemark
      observe: "response" as 'body'
    };
  }

  private generateRoute(route: string, routeParam: any = null, queryParams: string = null) {
    if (!routeParam && !queryParams) {
      return route;
    }
    if (routeParam && queryParams) {
      return route + '/' + routeParam + queryParams;
    }
    if (!routeParam) {
      return route + queryParams;
    }
    if (!queryParams) {
      return route + '/' + routeParam;
    }
  }

  fetchCurrentUser() {
    return this.http.post(this.meRoute, null, this.httpAuthOptions());
  }

  signup(data: any) {
    return this.http.post(this.signupRoute, data, this.httpResponseOptions());
  }

  signin(data: any) {
    return this.http.post(this.signinRoute, data, this.httpResponseOptions());
  }

  saveReport(data: any) {
    return this.http.post(this.addReportRoute, data, this.httpAuthOptions());
  }

  updateReport(data: any, reportId: string) {
    return this.http.put(this.generateRoute(this.updateReportRoute, reportId), data, this.httpAuthOptions());
  }

  getStats(position: string): any {
    return this.http.get(this.generateRoute(this.getStatsByPosition, position));
  }

  saveGame(data: any, reportId: string) {
    return this.http.put(this.generateRoute(this.addGameToReportRoute, reportId), data, this.httpAuthOptions());
  }

  fetchPlayers(): any {
    return this.http.get(this.getPlayersRoute);
  }

  savePlayer(data: any): any {
    return this.http.post(this.addPlayerRoute, data, this.httpAuthOptions());
  }

  getSkills(position: string): any {
    return this.http.get(this.generateRoute(this.getSkillsByPosition, position));
  }

  getMyReports(): any {
    return this.http.get(this.generateRoute(this.getReportsByUserIdRoute, this.userService.getCurrentUser()._id));
  }

  getCommunityReports(queryParams: string) {
    return this.http.get(this.generateRoute(this.getReportsRoute, null, queryParams));
  }

  rateReport(data: any, reportId: string) {
    return this.http.put(this.generateRoute(this.rateReportRoute, reportId), data, this.httpAuthOptions());
  }

}