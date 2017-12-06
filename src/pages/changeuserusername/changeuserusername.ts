import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the ChangeuserusernamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-changeuserusername',
  templateUrl: 'changeuserusername.html',
})
export class ChangeuserusernamePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http:HttpClient,
              private toastCtrl:ToastController,
              private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeuserusernamePage');
  }
  chnageUsername(f: NgForm){
    this.storage.get('apiKey').then(val => {

      const body = {login: f.value.username};
      let jString = JSON.stringify(body);
      this.http.post('http://keedobook.fr/auth/v1/updateuser', jString,{
        headers: new HttpHeaders().set('Authorization',val),
      }).subscribe(res=>{
        if(res['error']==false){
          this.toastCtrl.create({
            message: res['message'],
            duration: 3000,
            position: 'bottom'
          }).present();

          //this.navCtrl.pop();
        }else{
          this.toastCtrl.create({
            message: res['message'],
            duration: 3000,
            position: 'bottom'
          }).present();
        }
        console.log(res);
      });
    });

  }
}
