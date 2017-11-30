import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HTTP} from "@ionic-native/http";

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
  modules: string[];


  constructor(public navCtrl: NavController, public navParams: NavParams,private http: HTTP) {
    this.initializeModules();
  }
  onInput(ev: any){

  }
  initializeModules(){
    this.modules = [
      ' Accounting & Finance',
      'Architecture',
      'Art',
      'Business & Management',
      'Computing',
      'Engineering',
      'Nursing & Health',
      'Pharmacy & Life Sciences',
      'Biographies',
      'Fiction',
      'References & Study Guides'
    ];
  }
  getBooks(){
    this.http.get('http://ionic.io', {}, {})
      .then(data => {

        console.log(data.status);
        console.log(data.data); // data received by server
        console.log(data.headers);

      })
      .catch(error => {

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });
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
