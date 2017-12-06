import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {NgForm} from "@angular/forms";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Storage} from "@ionic/storage";
import {RegisterPage} from "../register/register";

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
              private storage: Storage
  ) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  switchpage(){
    this.navCtrl.setRoot(TabsPage);
  }
  registerPage(){
    this.navCtrl.push(RegisterPage);
  }
  login(f: NgForm){
    const body = {email: f.value.email,password:f.value.password};

    let truc = JSON.stringify(body);
    this.http.post('http://keedobook.fr/auth/v1/login', truc,{
      params: new HttpParams().set('email', f.value.email).set('password',f.value.password),
      //headers: new HttpHeaders().set('Content-Type','application/json'),
    })
      // See below - subscribe() is still necessary when using post().
      .subscribe(res=>{
        this.api = res;
        if(res['error']==true){
          this.toastCtrl.create({
            message: res['message'],
            duration: 3000,
            position: 'bottom'
          }).present();
        }else{
          this.storage.set('username',res['login']);
          this.storage.set('apiKey',res['apiKey'] );
          this.storage.set('id',res['id']);
          /* Or to get a key/value pair
          this.storage.get('id').then((val) => {
            console.log('Your id', val);
            id = val;
          });
          //*/
          this.switchpage();

          this.toastCtrl.create({
            message: 'Logged in.',
            duration: 2000,
            position: 'bottom'
          }).present();
        }
      });


  }

}
