import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {ChangeuserPage} from "../changeuser/changeuser";
import {SqlProvider} from "../../providers/sql/sql";
import {TransactionsPage} from "../transactions/transactions";

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
              private sqlProvider: SqlProvider,
              public app:App
  ) {

  }
  ionViewWillEnter(){
  }
  logoutPage(){
    let p1 = this.sqlProvider.removeUsername();
    let p2 = this.sqlProvider.removeApiKey();
    let p3 = this.sqlProvider.removeUserId();
    let p4 = this.sqlProvider.setLoggedIn(false);

    Promise.all([p1,p2,p3,p4])
      .then(() => {
        console.log('onfulfilled');
        this.app.getRootNav().setRoot(LoginPage);
        this.toastCtrl.create({
          message: 'Logged out.',
          duration: 2000,
          position: 'bottom'
        }).present();
      })
      .catch(res => {
        console.error(res);
      });
    //*/

    }
  changeUserPage(){
    this.navCtrl.push(ChangeuserPage);
  }

  transactionPage(){
    this.navCtrl.push(TransactionsPage);
  }

}
