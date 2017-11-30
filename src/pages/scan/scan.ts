import {Component, ViewChild} from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {IonicPage, NavController, NavParams, Tabs} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";

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
  @ViewChild('myTabs') tabRef: Tabs;

  ISBMcode: any;
  ISBMformat: any;
  books: any;
  myInput: any;
  searching: any;
  events:any;
  private dataUrl = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
  //1409096823

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private barcodeScanner: BarcodeScanner,
              private http: HttpClient) {


  }
  log(e){
    //console.log(e);
    this.events = e;
  }
  launchScan(){
    this.barcodeScanner.scan().then((barcodeData) => {
      this.ISBMcode = barcodeData.text;
      this.ISBMformat = barcodeData.format;
      if(this.ISBMcode){
        this.getBook(this.ISBMcode);
      }

    }, (err) => {
    });
  }

  getBook(code:any){
    this.searching=1;
    this.http.get(this.dataUrl+code).subscribe(data => {

      this.books = data['items'];
      this.searching=0;
      console.log(this.books)
    })
  }
  swipeEvent(e){
    console.log(e);
    this.navCtrl.parent.select(1);
  }
  onSubmit(f: NgForm) {
    console.log(f.value.ISBM);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }
}
//<img [src]="books.imageLinks.thumbnail"/>
