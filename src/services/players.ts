import { AuthService } from './auth';
import { Skill } from './../models/skill';
import { Injectable } from '@angular/core';
import { Player } from '../models/player';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from '../constants/api';

@Injectable()
export class PlayersService {

    private players: Player[] = [];

    constructor(
        private http: HttpClient, private auth: AuthService
    ) { }

    fetchPlayers(): any {
        return this.http.get(Api.URI + 'players');
    }

    savePlayer(player: Player): any {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'x-auth-token': this.auth.getCurrentUser().getToken()
            })
        };

        const data = {
            name: player.name,
            club: player.club,
            position: player.position,
            country: player.country,
            age: player.age,
            imgName: player.imgName
        }

        return this.http.post(Api.URI + 'players', data, httpOptions);
    }

    setPlayers(players: Player[]): void {
        this.players = players;
    }

    getPlayers(): Player[] {
        return this.players.slice();
    }

    getSkills(position: string): any {
        return this.http.get(Api.URI + 'skills/' + position);
    }

}