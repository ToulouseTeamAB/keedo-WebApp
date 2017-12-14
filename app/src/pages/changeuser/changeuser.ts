import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ChangeuseremailPage} from "../changeuseremail/changeuseremail";
import {ChangeuserusernamePage} from "../changeuserusername/changeuserusername";
import {ChangeuserpasswordPage} from "../changeuserpassword/changeuserpassword";

/**
 * Generated class for the ChangeuserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-changeuser',
  templateUrl: 'changeuser.html',
})
export class ChangeuserPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeuserPage');
  }
  changeUserEmail(){
    this.navCtrl.push(ChangeuseremailPage);
  }
  changeUserUsername(){
    this.navCtrl.push(ChangeuserusernamePage);
  }
  changeUserPassword(){
    this.navCtrl.push(ChangeuserpasswordPage);
  }

}
