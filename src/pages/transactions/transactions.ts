import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TransactionsBuyPage} from "../transactions-buy/transactions-buy";
import {TransactionsSellPage} from "../transactions-sell/transactions-sell";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {SqlProvider} from "../../providers/sql/sql";

/**
 * Generated class for the TransactionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {
  apiKey: any;
  dataTransBuy: any;
  dataTransSell: any;
  idUser: any;
  tab1Root = TransactionsBuyPage;
  tab2Root = TransactionsSellPage;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http:HttpClient,
              private sqlProvider: SqlProvider) {
    let p1 = this.sqlProvider.getUserId();
    let p2 = this.sqlProvider.getApiKey();
    Promise.all([p1,p2]).then(res => {
      this.idUser = res[0];
      this.apiKey = res[1];
      this.getTransactions();
      console.log(this.apiKey);

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionsPage');
    //this.getTransactions();

  }

  getTransactions(){
    this.http.get('http://keedobook.fr/auth/v1/getLog',{
      params: new HttpParams().set('id', this.idUser),
      headers: new HttpHeaders().set('Authorization',this.apiKey),
    }).subscribe(res => {
      console.log(res);
      this.dataTransBuy = res['buy'];
      this.dataTransSell = res['sell'];
    },error => {
      console.error('Search http error :'+error.message);
      console.error('Search http error :'+error.name);

    });
  }

}
