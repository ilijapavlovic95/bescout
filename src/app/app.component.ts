import { AuthService } from './../services/auth';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { SigninPage } from '../pages/signin/signin';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private authService: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.authService.getCurrentUserFromStorage()
        .then((currentUser) => {
          if (currentUser) {
            this.authService.setCurrentUser(currentUser);
            console.log('on app start:', this.authService.getCurrentUser());
            this.rootPage = TabsPage;
          } else {
            this.rootPage = SigninPage
          }
          // this.authService.fetchCurrentUser(token).subscribe(
          //   (data: any) => {
          //     data.token = token;
          //     this.authService.setCurrentUser(data);
          //     this.rootPage = TabsPage;
          //   },
          // );
        })
        .catch((err) => this.rootPage = SigninPage);
      

      
    });
  }
}
