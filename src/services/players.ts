import { CallBroker } from './callBroker';
import { AuthService } from './auth';
import { Skill } from './../models/skill';
import { Injectable } from '@angular/core';
import { Player } from '../models/player';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class PlayersService {

    private players: Player[] = [];

    constructor(
        private callBroker: CallBroker
    ) { }

    fetchPlayers(): any {
        return this.callBroker.fetchPlayers();
    }

    savePlayer(player: Player): any {

        const data = {
            name: player.name,
            club: player.club,
            position: player.position,
            country: player.country,
            age: player.age,
            imgName: player.imgName
        }

        return this.callBroker.savePlayer(data);
    }

    setPlayers(players: Player[]): void {
        this.players = players;
    }

    getPlayers(): Player[] {
        return this.players.slice();
    }

    getSkills(position: string): any {
        return this.callBroker.getSkills(position);
    }

}