import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TransactionsSellPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-transactions-sell',
  templateUrl: 'transactions-sell.html',
})
export class TransactionsSellPage {
  sellTransactions: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.sellTransactions =  this.navParams.data;
    console.log(this.sellTransactions);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionsSellPage');
  }

}
