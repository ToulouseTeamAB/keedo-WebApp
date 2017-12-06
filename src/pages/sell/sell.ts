import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the SellPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sell',
  templateUrl: 'sell.html',
})
export class SellPage {
  book:any;
  book_ISBN:any;
  sellPrice:any;
  description:any;
  apiKey:any;
  userId:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http:HttpClient,
              private storage:Storage,
              private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SellPage');
    this.book = this.navParams.get('items')['0'];
  }

  postSellBook(){
    let myV = this.book.volumeInfo.industryIdentifiers;
    for(let myB of myV){
      if(myB.type==='ISBN_13'){
        this.book_ISBN=myB.identifier;
      }
    }

    this.storage.get('apiKey').then(val =>
    {
      this.apiKey = val;

      this.storage.get('id').then(res =>
      {

        this.userId = res;
        const body = {
          ISBN:this.book_ISBN,
          modules:2,
          userID:this.userId,
          price:this.sellPrice,
          bookcondition:this.description};

        let jString = JSON.stringify(body);
        this.http.post('http://keedobook.fr/auth/v1/sellbook', jString,{
          headers: new HttpHeaders().set('Authorization',this.apiKey),
        }).subscribe(res =>{
          if(res['error']==false){
            this.toastCtrl.create({
              message: res['message'],
              duration: 3000,
              position: 'bottom'
            }).present();

          }else{
            this.toastCtrl.create({
              message: res['message'],
              showCloseButton: true,
              position: 'bottom'
            }).present();
          }
        });
      });
    });


  }
}
