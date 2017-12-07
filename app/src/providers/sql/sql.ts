import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";

/*
  Generated class for the SqlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqlProvider {

  private apiKey: any;
  private userId: any;
  private username:any;
  private loggedIn:any;
  constructor(
    private storage: Storage
  ) {
    this.apiKey = this.storage.get('apiKey');
    this.userId = this.storage.get('id');
    this.username = this.storage.get('username');
    this.loggedIn = this.storage.get('loggedIn');
    //console.log('Hello SqlProvider Provider');
  }

  //*
  getApiKey(): Promise<any>{
    //*
    if(this.apiKey==null){
      this.storage.get('apiKey').then(res =>{
        this.apiKey = res;

      })
        .catch(err => this.handleError(err));

    }else{
      return this.apiKey;
    }
    //*/
    /*
    return new Promise( (resolve,reject) => {
      if(this.apiKey==null){
        console.log('apikey is null');
        this.storage.get('apiKey').then(res =>{
          this.apiKey = res;
          resolve(this.apiKey);

        }).catch(err => reject(err))

      }else{
        console.log('apikey is '+this.apiKey);

        resolve(this.apiKey);
      }
    })
    //*/

  }
  getUserId(): Promise<any>{
    return this.storage.get('id')
      .catch(err => this.handleError(err));
  }
  getUsername(): Promise<any>{
    return this.storage.get('username')
      .catch(err => this.handleError(err));
  }
  getLoggedIn(): Promise<any>{
    return this.storage.get('loggedIn'
    ).catch(err => this.handleError(err));
  }
  setApiKey(apiKey: any): Promise<any>{
    return this.storage.set('apiKey',apiKey)
      .catch(err => this.handleError(err));
  }
  setUserId(userId: any): Promise<any>{
    return this.storage.set('id',userId)
      .catch(err => this.handleError(err));
  }
  setUsername(username: any): Promise<any>{
    return this.storage.set('username',username)
      .catch(err => this.handleError(err));
  }
  setLoggedIn(ploggedIn: any):Promise<any>{
    return this.storage.set('loggedIn',ploggedIn)
    .catch(err => this.handleError(err));

  }
  removeApiKey():Promise<any> {
    this.apiKey = null;
    return this.storage.remove('apiKey')
      .catch(err => this.handleError(err));
  }
  removeUserId():Promise<any>{
    this.userId = null;
    return this.storage.remove('id')
      .catch(err => this.handleError(err));
  }
  removeUsername():Promise<any>{
    this.username = null;
    return this.storage.remove('username')
      .catch(err => this.handleError(err));
  }
  removeLoggedIn():Promise<any>{
    this.loggedIn = false;
    return this.storage.remove('loggedIn')
      .catch(err => this.handleError(err));
  }
  //*/
  handleError(err){
    console.error('error: '+err)
  }
}
