import { Game } from './../models/game';
import { Api } from './../constants/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Report } from './../models/report';
import { Injectable } from '@angular/core';

@Injectable()
export class MyReportService {

    private report: Report = new Report('',null,null,null,[],[],0);

    constructor(private http: HttpClient){}

    getReport(){
        return this.report;
    }

    setReport(report: Report){
        this.report = report;
    }

    saveReport(report: Report) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const data = {
            playerId: report.player._id,
            skills: report.skills
        }

        return this.http.post(Api.URI + 'reports', data, httpOptions);
    }

    updateReport(report: Report) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const data = {
            playerId: report.player._id,
            skills: report.skills
        }

        return this.http.put(Api.URI + 'reports/' + report._id, data, httpOptions);
    }

    getStats(position: string): any {
        return this.http.get(Api.URI + 'stats/' + position);
    }

    // saveGame(report: Report) {
    //     const httpOptions = {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         })
    //     };

    //     const data = report;

    //     return this.http.put(Api.URI + 'reports/games/' + report._id, data, httpOptions);
    // }

    saveGame(report: Report, game: Game) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const data = game;

        return this.http.put(Api.URI + 'reports/games/' + report._id, data, httpOptions);
    }

}