import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {BuyListPage} from "../buy-list/buy-list";
import {BuyPage} from "../buy/buy";

/**
 * Generated class for the ModuleBookListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-module-book-list',
  templateUrl: 'module-book-list.html',
})
export class ModuleBookListPage {
  moduleID: any;
  moduleTitle: any;
  books: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient) {
    this.moduleID = this.navParams.get('id');
    this.moduleTitle = this.navParams.get('title');
    this.initializeModule();


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModuleBookListPage');

  }
  initializeModule(){
    this.http.get('http://keedobook.fr/auth/v1/modules/'+this.moduleID).subscribe(res => {
      this.books = res;
      console.log(res);
    });
  }
  buyPage(book:any){
    this.navCtrl.push(BuyPage,{
      book_ISBN: book.ISBN,
      book: [book]
    })
  }
}
