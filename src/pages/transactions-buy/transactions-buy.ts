import {Component, Input} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TransactionsBuyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-transactions-buy',
  templateUrl: 'transactions-buy.html',
})
export class TransactionsBuyPage {
  buyTransactions: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.buyTransactions =  this.navParams.data;
    console.log(this.buyTransactions);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionsBuyPage');
  }

}
