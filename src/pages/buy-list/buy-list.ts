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
  books:any[];
  dataUrl:string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http:HttpClient,
              private inAppBrowser:InAppBrowser) {
  }

  ionViewWillEnter(){
    this.getBuyList('df');
  }
  getBuyList(code:any){
    this.searching=1;
    this.http.get(this.dataUrl+code).subscribe(data => {

      this.books = data['items'];
      this.searching=0;

    })
  }
  openAppBrowser(){
    this.inAppBrowser.create('https://ionicframework.com/','_system','zoom=no');
  }

}
