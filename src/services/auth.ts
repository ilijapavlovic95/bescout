import { UserService } from './userService';
import { CallBroker } from './callBroker';
import { User } from './../models/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthService {

  constructor(private userService: UserService, private callBroker: CallBroker) { }

  setCurrentUser(currentUser: User) {
    this.userService.setCurrentUser(currentUser);
  }

  getCurrentUser() {
    return this.userService.getCurrentUser();
  }

  fetchCurrentUser(token) {
    return this.callBroker.fetchCurrentUser();
  }

  signup(user: User) {
    const data = user;

    return this.callBroker.signup(data);
  }

  signin(email, password) {
    const data = {
      email: email,
      password: password
    };

    return this.callBroker.signin(data);
  }

  saveCurrentUserToStorage(user) {
    return this.userService.saveCurrentUserToStorage(user);
  }

  // vraca Promise
  getCurrentUserFromStorage() {
    return this.userService.getCurrentUserFromStorage();

  }

  signout() {
    return this.userService.signout();
  }

}