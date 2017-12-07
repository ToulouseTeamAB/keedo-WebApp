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
import {HttpClientModule} from "@angular/common/http";
import {BuyListPage} from "../pages/buy-list/buy-list";

import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Keyboard} from "@ionic-native/keyboard";
import {IonicStorageModule} from "@ionic/storage";
import {RegisterPage} from "../pages/register/register";
import {SellPage} from "../pages/sell/sell";
import {ChangeuserPage} from "../pages/changeuser/changeuser";
import {ChangeuseremailPage} from "../pages/changeuseremail/changeuseremail";
import {ChangeuserusernamePage} from "../pages/changeuserusername/changeuserusername";
import {ChangeuserpasswordPage} from "../pages/changeuserpassword/changeuserpassword";
import {SqlProvider} from '../providers/sql/sql';
import {ModuleBookListPage} from "../pages/module-book-list/module-book-list";
import {TransactionsPage} from "../pages/transactions/transactions";
import {TransactionsBuyPage} from "../pages/transactions-buy/transactions-buy";
import {TransactionsSellPage} from "../pages/transactions-sell/transactions-sell";
import {BuyPage} from "../pages/buy/buy";



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
    SellPage,
    ChangeuserPage,
    ChangeuseremailPage,
    ChangeuserusernamePage,
    ChangeuserpasswordPage,
    ModuleBookListPage,
    TransactionsPage,
    TransactionsBuyPage,
    TransactionsSellPage,
    BuyPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
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
    SellPage,
    ChangeuserPage,
    ChangeuseremailPage,
    ChangeuserusernamePage,
    ChangeuserpasswordPage,
    ModuleBookListPage,
    TransactionsPage,
    TransactionsBuyPage,
    TransactionsSellPage,
    BuyPage
  ],
  providers: [
    SqlProvider,
    Storage,
    InAppBrowser,
    BarcodeScanner,
    Keyboard,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

  ]
})
export class AppModule {}
