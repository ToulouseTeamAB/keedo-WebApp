import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import {StatusBar } from '@ionic-native/status-bar';
import {SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";
import {SearchPage} from "../pages/search/search";
import {SettingsPage} from "../pages/settings/settings";
import {ScanPage} from "../pages/scan/scan";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {HTTP} from "@ionic-native/http";
import {HttpClientModule} from "@angular/common/http";
import {BuyListPage} from "../pages/buy-list/buy-list";

import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Keyboard} from "@ionic-native/keyboard";
import {IonicStorageModule} from "@ionic/storage";
import {RegisterPage} from "../pages/register/register";
import {SellPage} from "../pages/sell/sell";



@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    SearchPage,
    SettingsPage,
    ScanPage,
    BuyListPage,
    RegisterPage,
    SellPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    SearchPage,
    SettingsPage,
    ScanPage,
    BuyListPage,
    RegisterPage,
    SellPage
  ],
  providers: [
    HTTP,
    InAppBrowser,
    BarcodeScanner,
    Keyboard,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
