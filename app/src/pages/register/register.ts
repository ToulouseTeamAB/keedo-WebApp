import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {NgForm} from "@angular/forms";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http:HttpClient,
              private toastCtrl: ToastController,
              ) {}

  register(f: NgForm){
    const body = {login: f.value.username,email: f.value.email,password:f.value.password};

    let truc = JSON.stringify(body);
    this.http.post('http://keedobook.fr/auth/v1/register', truc,{
      headers: new HttpHeaders().set('Content-Type','application/json'),
    }).subscribe(res=>{
      if(res['error']==false){
        this.toastCtrl.create({
          message: res['message'],
          duration: 3000,
          position: 'bottom'
        }).present();

        this.navCtrl.pop();
      }else{
        this.toastCtrl.create({
          message: res['message'],
          duration: 3000,
          position: 'bottom'
        }).present();
      }
      console.log(res);
      }
    );



  }
}
