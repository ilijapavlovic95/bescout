import { Subscription } from 'rxjs/Subscription';
import { PlayersService } from './../../services/players';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Player } from '../../models/player';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/**
 * Generated class for the PlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage implements OnInit, OnDestroy{

  subscription: Subscription;

  imgName: number = 3; // ovo treba da se menja kad se bira avatar
  playerForm: FormGroup;
  positions = ['GK','CB','RB','LB','DM','CM','AMC','AML','AMR','ST'];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private playersService: PlayersService) {
  }

  ngOnInit(): void {
    this.playerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      position: new FormControl('GK'),
      country: new FormControl('', Validators.required),
      club: new FormControl('', Validators.required),
      age: new FormControl(null, Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerPage');
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

  previousAvatar() {
    if (this.imgName === 1)
      return;
    this.imgName--;
  }

  nextAvatar() {
    if (this.imgName === 4)
      return;
    this.imgName++;
  }

  addPlayer() {
    if(this.playerForm.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'You have to add all values.',
        buttons: ['OK']
      });
      alert.present();
    } else {
      const values = this.playerForm.value;
      let player = new Player('0', values.name, values.position, values.club, values.country, values.age, this.imgName.toFixed(0));
      
      this.subscription = this.playersService.savePlayer(player).subscribe(
        data => {
          player._id = data.player._id;
          this.viewCtrl.dismiss({selectedPlayer: player});
        },
        error => console.log(error)
      );
      
    }
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
