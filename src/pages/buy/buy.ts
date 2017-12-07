import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';

/**
 * Generated class for the BuyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-buy',
  templateUrl: 'buy.html',
})
export class BuyPage {
  book_ISBN:any;
  book:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuyPage');
  }
  ionViewWillEnter(){
    this.book_ISBN = this.navParams.get('book_ISBN');
    this.book = this.navParams.get('book')['0'];
    console.log(this.book)
  }

  bookBuy(){
    this.toastCtrl.create({
      message: 'Book bought',
      duration: 3000,
      position: 'bottom'
    }).present();
  }

}
