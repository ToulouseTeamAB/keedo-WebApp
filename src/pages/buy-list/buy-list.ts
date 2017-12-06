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
  books:any[];
  bookInfo:any;
  dataUrl:string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http:HttpClient,
              private inAppBrowser:InAppBrowser) {
  }

  ionViewWillEnter(){
    //this.getBuyList('df');
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad SellPage');
    this.book_ISBN = this.navParams.get('book_ISBN');
    this.bookInfo = this.navParams.get('books')['0'];
  }

  getBuyList(code:any){
    this.searching=1;
    this.http.get(this.dataUrl+code).subscribe(data => {

      this.books = data['items'];
      this.searching=0;

    })
  }
  openAppBrowser(){
    this.inAppBrowser.create('https://www.amazon.co.uk/gp/search?index=books&linkCode=qs&keywords='+this.book_ISBN,'_system','zoom=no');
  }

}
