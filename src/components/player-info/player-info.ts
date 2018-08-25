import { Player } from './../../models/player';
import { Component, Input } from '@angular/core';

/**
 * Generated class for the PlayerInfoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'player-info',
  templateUrl: 'player-info.html'
})
export class PlayerInfoComponent {

  @Input() player: Player;

  constructor() {
    console.log('Hello PlayerInfoComponent Component');
  }

}
