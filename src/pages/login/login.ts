import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {NgForm} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";

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
  ) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  switchpage(){
    this.navCtrl.setRoot(TabsPage);
  }
  login(f: NgForm){
    //  console.log(f.value.ISBM);  // { first: '', last: '' }
    //console.log(f.valid);  // false
    console.log(f.value.email);
    console.log(f.value.password);
    const body = {email: f.value.email,password:f.value.password};
    console.log(body);

    let truc = JSON.stringify(body);
    console.log(truc);
    this.http.post('https://keedobook.fr/auth/v1/login', body)
      // See below - subscribe() is still necessary when using post().
      //'Access-Control-Allow-Origin': '*'
      .subscribe(data=>{
        this.api =data;
        let toast = this.toastCtrl.create({
          message: 'connected',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      });
    if(!this.api){
      let toast = this.toastCtrl.create({
        message: 'failed',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }

  }

}
