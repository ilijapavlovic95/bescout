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
  playersForView: Player[];
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
    this.playersForView = [];
    this.players = [];
    this.subscription = this.playersService.fetchPlayers().subscribe(
      data => {
        const players: any[] = data.players;
        for (const player of players) {
          this.players.push(new Player(player._id, player.name, player.position, player.club, player.country, player.age,player.imgName));
          this.playersForView.push(new Player(player._id, player.name, player.position, player.club, player.country, player.age,player.imgName));
        }
        this.playersForView = this.playersForView.sort((a, b) => {
          if (a.name > b.name)
            return 1;
          return -1;
        });
      },
      err => console.log(err)
    );
  }

  resetPlayersForView() {
    this.playersForView = [];
    for (const pl of this.players) {
      this.playersForView.push(pl);
    }
  }

  filterPlayers(event){
    console.log(event);
    this.resetPlayersForView();

    const val = event.target.value;
    console.log(val);

    if (val && val.trim() != '') {
      console.log('in if: ', val);
      
      this.playersForView = this.playersForView.filter((player: Player) => {
        return (player.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });

      this.playersForView = this.playersForView.sort((a, b) => {
        if (a.name > b.name)
          return 1;
        return -1;
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
