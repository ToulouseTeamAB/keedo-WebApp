import {Component, ViewChild} from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {IonicPage, NavController, NavParams, Tabs, ToastController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {BuyListPage} from "../buy-list/buy-list";
import {Keyboard} from "@ionic-native/keyboard";
import {SellPage} from "../sell/sell";


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
  id: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private barcodeScanner: BarcodeScanner,
              private http: HttpClient,
              private toastCtrl: ToastController,
              private keyboard:Keyboard,
  ) {}
  log(e){
    //console.log(e);
    this.events = e;
  }

  ionViewDidLoad() {
    /*this.storage.get('apiKey').then((val) => {
      console.log('Your id', val);
      this.id =val;
    }); //*/
  }

  launchScan(){
    this.barcodeScanner.scan().then((barcodeData) => {
      this.ISBMcode = barcodeData.text;
      this.ISBMformat = barcodeData.format;
      if(this.ISBMcode){
        this.getBook(this.ISBMcode);
      }

    }, (err) => {
        let toast = this.toastCtrl.create({
          message: 'Cannot access camera.',
          duration: 3000,
          position: 'bottom'
        });

        toast.onDidDismiss(() => {
          //console.log('Dismissed toast');
        });

        toast.present();
    });
  }

  getBook(code:any){
    this.keyboard.close();
    this.searching=1;
    this.http.get(this.dataUrl+code).subscribe(data => {

      this.books = data['items'];
      this.searching=0;
      console.log(this.books);
      if(data['totalItems']==0){
        let toast = this.toastCtrl.create({
          message: 'Error in ISBN',
          duration: 3000,
          position: 'bottom'
        });

        toast.onDidDismiss(() => {
          //console.log('Dismissed toast');
        });

        toast.present();      }
    })
  }

  buyPage() {
    let pic = this.books['0'].volumeInfo.imageLinks.thumbnail;
    console.log(this.books['0'].volumeInfo.imageLinks.thumbnail);
    let spebook = {

        picture:pic,
        title:this.books['0'].volumeInfo.title,

    };
    //1409096823
    let book_ISBN;
    let myV = this.books['0'].volumeInfo.industryIdentifiers;
    for(let myB of myV){
      if(myB.type==='ISBN_13'){
        book_ISBN=myB.identifier;
      }
    }
    this.navCtrl.push(BuyListPage,{
      book_ISBN: book_ISBN,
      book: [spebook]
    });
  }

  sellPage(){
    this.navCtrl.push(SellPage,{
      items: this.books
    });
  }
}
