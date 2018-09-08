import { CallBroker } from './callBroker';
import { AuthService } from './auth';
import { Game } from './../models/game';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Report } from './../models/report';
import { Injectable } from '@angular/core';

@Injectable()
export class MyReportService {

    constructor(private callBroker: CallBroker) {}

    private report: Report = new Report('',null,null,null,[],[],0);

    getReport(){
        return this.report;
    }

    setReport(report: Report){
        this.report = report;
    }

    saveReport(report: Report) {
        const data = {
            playerId: report.player._id,
            skills: report.skills
        }

        return this.callBroker.saveReport(data);
    }

    updateReport(report: Report) {
        const data = {
            playerId: report.player._id,
            skills: report.skills,
            endDate: report.endDate
        }

        return this.callBroker.updateReport(data, report._id);
    }

    getStats(position: string): any {
        return this.callBroker.getStats(position);
    }

    saveGame(report: Report, game: Game) {
        const data = game;

        return this.callBroker.saveGame(data, report._id);
    }

}