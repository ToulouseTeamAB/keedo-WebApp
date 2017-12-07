import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Keyboard} from "@ionic-native/keyboard";
import {BuyListPage} from "../buy-list/buy-list";
import {ModuleBookListPage} from "../module-book-list/module-book-list";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  bookName: any;
  modules: any;
  searchResults: any;
  showResults: boolean;
  searching: boolean;
  httpSearch: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              private keyboard:Keyboard) {
    this.initializeModules();
    this.showResults = false;
    this.searching = false;
  }
  onFocusOut(e:any){
    this.keyboard.close();
  }
  onInput(ev: any){

    if(this.bookName.length>0){
      this.searching = true;

      this.httpSearch = this.http.get('http://keedobook.fr/auth/v1/search',{
        params: new HttpParams().set('bookName', this.bookName),
      }).subscribe(res => {
        this.showResults = true;
        this.searching = false;
        this.searchResults = res;
      },error => {
        console.error('Search http error :'+error.message);
        console.error('Search http error :'+error.name);

        this.searching = false;
      });
    }else{
      this.searching = false;
      this.showResults = false;
    }
  }
  initializeModules(){
    this.http.get('http://keedobook.fr/auth/v1/modules').subscribe(res => {
      this.modules = res['modules'];
      //console.log(res);
    });
  }
  getBooks(){
  }
  onCancel(ev: any){

  }
  buyPage(book:any){
    this.navCtrl.push(BuyListPage,{
      book_ISBN: book.ISBN,
      book: [book]
    })
  }
  /*
  sellPage(book:any){
    let volume = {
      book:{
        volumeInfo:{
          imageLinks:{
            thumbnail:book.picture
          },
          title:book.title,
          authors:book.author
        }
      }
    }
  }
  //*/
  viewModule(id:any,title:any){
    this.navCtrl.push(ModuleBookListPage,{
      id:id,
      title:title
    })
  }
}
