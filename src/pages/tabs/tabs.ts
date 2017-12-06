import { Component } from '@angular/core';
import {IonicPage} from 'ionic-angular';

import {ScanPage} from "../scan/scan";
import {SearchPage} from "../search/search";
import {SettingsPage} from "../settings/settings";
import {Storage} from "@ionic/storage";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  isLoggedIn: boolean;
  tab1Root = ScanPage;
  tab2Root = SearchPage;
  tab3Root = SettingsPage;

  constructor(private storage: Storage) {


  }
  ionViewDidLoad() {
    /*
    console.log('tabs');
    this.storage.get('apiKey').then(value => {
      console.log(value);
      //*
      if(value == null){
        this.isLoggedIn = false;
      }else{
        this.isLoggedIn = true;
      }

      this.storage.set('loggedIn',this.isLoggedIn);

    });
*/
  }

}
