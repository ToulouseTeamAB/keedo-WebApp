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
}
