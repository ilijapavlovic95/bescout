import { User } from './../../models/user';
import { TabsPage } from './../tabs/tabs';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './../../services/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage implements OnInit, OnDestroy {

  subscriptionSignin: Subscription;
  subscriptionSignup: Subscription;
  signinForm: FormGroup;
  signupForm: FormGroup;
  mode: string;
  validationText: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private loadingCtrl: LoadingController) {
  }

  ngOnInit(): void {
    this.mode = 'signin';
    this.initializeForms();
  }

  initializeForms() {
    this.signinForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.min(7)])
    });

    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.min(7)]),
      username: new FormControl(null, Validators.required),
      fullname: new FormControl(null, Validators.required)
    });
  }

  onSignin() {
    console.log(this.signinForm);
    if (this.signinForm.invalid) {
      this.generateValidationText();
      return;
    }

    let loading = this.loadingCtrl.create({
      content: 'Please wait ...'
    });
    loading.present();

    this.subscriptionSignin = this.authService.signin(this.signinForm.value.email, this.signinForm.value.password)
      .subscribe(
        (data: any) => {
          this.authService.saveTokenToStorage(data.token)
            .then((value) => {
              loading.dismiss();
              this.authService.setCurrentUser(data);
              this.navCtrl.setRoot(TabsPage);
            })
            .catch((err) => console.log(err));
        },
        (err) => {
          loading.dismiss();
          console.log(err);
          this.generateValidationText(err.error);
        }
      );

  }

  onSignup() {
    console.log(this.signupForm);
    if (this.signupForm.invalid) {
      this.generateValidationText();
      return;
    }

    const values = this.signupForm.value;
    let user = new User(values.username, values.email, values.username, 'member');
    user.password = values.password;

    let loading = this.loadingCtrl.create({
      content: 'Please wait ...'
    });
    loading.present();
    this.subscriptionSignup = this.authService.signup(user).subscribe(
      (data: any) => {
        this.authService.saveTokenToStorage(data.token)
          .then((value) => {
            loading.dismiss();
            this.authService.setCurrentUser(data);
            this.navCtrl.setRoot(TabsPage);
          })
          .catch((err) => console.log(err));
      },
      (err) => {
        loading.dismiss();
        console.log(err);
        this.generateValidationText(err.error);
      }
    );
  }

  generateValidationText(validationTextFromServer = null) {
    if (validationTextFromServer) {
      this.validationText = validationTextFromServer;
      return;
    }

    this.validationText = '';
    if (this.mode === 'signin') {

    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  ngOnDestroy(): void {
    if (this.subscriptionSignin)
      this.subscriptionSignin.unsubscribe();
    if (this.subscriptionSignup)
      this.subscriptionSignup.unsubscribe();
  }

}
