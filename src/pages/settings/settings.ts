import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";
import {ChangeuserPage} from "../changeuser/changeuser";

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private storage: Storage
  ) {
  }

  logoutPage(){
    this.storage.remove('username');
    this.storage.remove('apiKey');
    this.storage.remove('id');
    this.storage.set('loggedIn',false);

    this.navCtrl.setRoot(LoginPage);
    this.toastCtrl.create({
      message: 'Logged out.',
      duration: 2000,
      position: 'bottom'
    }).present();
  }
  changeUserPage(){
    this.navCtrl.push(ChangeuserPage);
  }
}
