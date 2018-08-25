import { Subscription } from 'rxjs/Subscription';
import { PlayersService } from './../../services/players';
import { Player } from './../../models/player';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams,  ViewController } from 'ionic-angular';

/**
 * Generated class for the PlayerSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-player-search',
  templateUrl: 'player-search.html',
})
export class PlayerSearchPage implements OnInit, OnDestroy{

  subscription: Subscription;

  players: Player[];
  selectedPlayer: Player;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private playersService: PlayersService,
    private viewCtrl: ViewController) {
  }

  ngOnInit(): void {
    this.initializePlayers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerSearchPage');
  }

  initializePlayers() {
    this.players = [];
    this.subscription = this.playersService.fetchPlayers().subscribe(
      data => {
        const players: any[] = data.players;
        for (const player of players) {
          this.players.push(new Player(player._id, player.name, player.position, player.club, player.country, player.age,player.imgName));
        }
      },
      err => console.log(err)
    );
  }

  filterPlayers(event){
    console.log(event);
    this.initializePlayers();

    const val = event.target.value;

    if (val && val.trim() != '') {
      this.players = this.players.filter((player: Player) => {
        return (player.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  selectPlayer(player: Player) {
    this.viewCtrl.dismiss({selectedPlayer: player});
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
