import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { LoginPage} from "../pages/login/login";
import {SqlProvider} from "../providers/sql/sql";
import {TabsPage} from "../pages/tabs/tabs";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private sqlProvider: SqlProvider) {
    platform.ready().then(() => {

      sqlProvider.getLoggedIn().then(res => {
        if(res==false||res==null){
          this.rootPage = LoginPage;
        }else{
          this.rootPage = TabsPage;
        }
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
