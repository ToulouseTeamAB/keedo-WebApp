import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {NgForm} from "@angular/forms";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Storage} from "@ionic/storage";
import {RegisterPage} from "../register/register";
import {SqlProvider} from "../../providers/sql/sql";
import {_catch} from "rxjs/operator/catch";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  api:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http:HttpClient,
              private toastCtrl: ToastController,
              private sqlProvider: SqlProvider  ) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    console.log(this.sqlProvider.getApiKey());
  }
  switchpage(){
    this.navCtrl.setRoot(TabsPage);
  }
  registerPage(){
    this.navCtrl.push(RegisterPage);
  }
  login(f: NgForm){
    const body = {email: f.value.email,password:f.value.password};

    this.http.post('http://keedobook.fr/auth/v1/login', JSON.stringify(body),{
      headers: new HttpHeaders().set('Content-Type','application/json'),
    }).subscribe(res => {
        this.api = res;
        if(res['error']==true){
          this.toastCtrl.create({
            message: res['message'],
            showCloseButton: true,
            position: 'bottom'
          }).present();
        }else{
          let p1 = this.sqlProvider.setUsername(res['login']);
          let p2 = this.sqlProvider.setApiKey(res['apiKey']);
          let p3 = this.sqlProvider.setUserId(res['id']);
          let p4 = this.sqlProvider.setLoggedIn(true);

          Promise.all([p1,p2,p3,p4])
            .then(res => {
              this.switchpage();
              console.log(res);
              this.toastCtrl.create({
                message: 'Logged in.',
                duration: 2000,
                position: 'bottom'
              }).present();
            }).catch(res => {
              console.error(res);
          })


        }
      });


  }

}
