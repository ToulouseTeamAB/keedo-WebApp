import { Component } from '@angular/core';

import {ScanPage} from "../scan/scan";
import {SearchPage} from "../search/search";
import {SettingsPage} from "../settings/settings";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = ScanPage;
  tab2Root = SearchPage;
  tab3Root = SettingsPage;

  constructor() {


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
