import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";

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
  myInput: any;
  modules: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,private http: HttpClient) {
    this.initializeModules();
  }
  onInput(ev: any){

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
  swipeEvent(e){
    console.log(e);
    if(e.direction===2) {
      this.navCtrl.parent.select(2);
    }
    if(e.direction===4) {
      this.navCtrl.parent.select(0);
    }
  }
}
