import { CallBroker } from './callBroker';
import { User } from './../models/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserService {

  currentUser: User;

  constructor(private storage: Storage) { }

  setCurrentUser(currentUser: User) {
    this.currentUser = currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  saveCurrentUserToStorage(user) {
    return this.storage.set('currentUser', user);
  }

  // vraca Promise
  getCurrentUserFromStorage() {
    return this.storage.get('currentUser');
  }

  signout() {
    return this.storage.clear();
  }

}