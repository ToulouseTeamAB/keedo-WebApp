import { Component } from '@angular/core';

import {ScanPage} from "../scan/scan";
import {SearchPage} from "../search/search";
import {SettingsPage} from "../settings/settings";
import {SqlProvider} from "../../providers/sql/sql";
import {NavController, NavParams} from "ionic-angular";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = ScanPage;
  tab2Root = SearchPage;
  tab3Root = SettingsPage;

  constructor(private sqlProvider: SqlProvider,
              public navCtrl: NavController,
              public navParams: NavParams,) {

  }
  ionViewWillEnter() {
    console.log('tabsPage');


  }
  ionViewWillUnload(){
    console.log('tabsPage');

  }

}
