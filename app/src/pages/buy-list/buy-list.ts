import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {InAppBrowser} from "@ionic-native/in-app-browser";

/**
 * Generated class for the BuyListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-buy-list',
  templateUrl: 'buy-list.html',
})
export class BuyListPage {
  searching=0;
  book_ISBN:any;
  books:any;
  bookInfo:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http:HttpClient,
              private inAppBrowser:InAppBrowser) {
  }

  ionViewWillEnter(){
    this.getBuyList();
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad SellPage');
    this.book_ISBN = this.navParams.get('book_ISBN');
    this.bookInfo = this.navParams.get('book')['0'];

  }

  getBuyList(){
    this.searching=1;
    this.http.get('http://keedobook.fr/auth/v1/books/'+this.book_ISBN,{
    }).subscribe(data => {
      console.log(data);
      this.books = data['books'];
      this.searching=0;

    })
  }
  openAppBrowser(){
    this.inAppBrowser.create('https://www.amazon.co.uk/gp/search?index=books&linkCode=qs&keywords='+this.book_ISBN,'_system','zoom=no');
  }

}
