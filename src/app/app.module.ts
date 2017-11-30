import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";
import {SearchPage} from "../pages/search/search";
import {SettingsPage} from "../pages/settings/settings";
import {ScanPage} from "../pages/scan/scan";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {HTTP} from "@ionic-native/http";
import {HttpClientModule} from "@angular/common/http";
import {SuperTabsModule} from "ionic2-super-tabs";


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    SearchPage,
    SettingsPage,
    ScanPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SuperTabsModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    SearchPage,
    SettingsPage,
    ScanPage
  ],
  providers: [
    HTTP,
    BarcodeScanner,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
