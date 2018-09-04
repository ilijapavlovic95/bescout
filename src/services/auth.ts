import { Api } from './../constants/api';
import { User } from './../models/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthService {

  currentUser: User;

  constructor(private storage: Storage, private http: HttpClient) { }

  setCurrentUser(data: any) {
    const user = data.user;
    this.currentUser = new User(user.username, user.email, user.fullname, user.role);
    this.currentUser._id = user._id;
    this.currentUser.setToken(data.token);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  fetchCurrentUser(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': token
      })
    };
    return this.http.post(Api.URI + 'users/me', null, httpOptions);
  }

  async isAuthorized() {
    try {
      const token = await this.storage.get('token');

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  signup(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const data = user;

    return this.http.post(Api.URI + 'users', data, httpOptions);
  }

  signin(email, password) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const data = {
      email: email,
      password: password
    };

    return this.http.post(Api.URI + 'auth', data, httpOptions);
  }

  saveTokenToStorage(token) {
    return this.storage.set('token', token);
  }

  // vraca Promise
  getTokenFromStorage() {
    return this.storage.get('token');

  }

  signout() {
    return this.storage.clear();
  }

}