import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {
  ISBMcode: any;
  ISBMformat: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private barcodeScanner: BarcodeScanner) {


  }
  launchScan(){
    this.barcodeScanner.scan().then((barcodeData) => {
      this.ISBMcode = barcodeData.text;
      this.ISBMformat = barcodeData.format;
    }, (err) => {
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanPage');
  }

}
