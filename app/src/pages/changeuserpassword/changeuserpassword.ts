import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Storage} from "@ionic/storage";
import {NgForm} from "@angular/forms";

/**
 * Generated class for the ChangeuserpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-changeuserpassword',
  templateUrl: 'changeuserpassword.html',
})
export class ChangeuserpasswordPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http:HttpClient,
              private storage:Storage,
              private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeuserpasswordPage');
  }
  changePassword(f:NgForm){
    this.storage.get('apiKey').then(val => {

      const body = {pass: f.value.password};
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
