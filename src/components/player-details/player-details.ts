import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the PlayerDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'player-details',
  templateUrl: 'player-details.html'
})
export class PlayerDetailsComponent {

  @Input('player') player;
  @Output() playerSelected = new EventEmitter();

  constructor() {
    console.log('Hello PlayerDetailsComponent Component');
  }

}
