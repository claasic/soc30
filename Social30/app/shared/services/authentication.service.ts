import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import * as appSettings from "tns-core-modules/application-settings";
import { map } from 'rxjs/operators';

import { Config } from '../config';
import { AppSettingsService } from '../services/appsettings.service';

@Injectable()
export class AuthenticationService {
    constructor(
        private http: HttpClient,
        private appSet: AppSettingsService) { }

    loginUrl = Config.apiUrl + "login";

    login(email: string, password: string) {
        
        // HttpParams is immutable so we need to concatinate
        // the .sets on creation
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Access-Control-Allow-Origin', '*');
        
        let params = new HttpParams()
            .set('logemail', email)
            .set('logpassword', password);

        // returns an Obserable and thus needs to be subscribed to otherwise
        // this aint gonna work
        return this.http.post<any>(this.loginUrl, params, {headers: headers})
            .pipe(
                map(user => {
                    console.log('reached map(user)')
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                        this.appSet.setUser('currentUser', JSON.stringify(user));
                    }
                return user;
                }));
    }

    logout() {
        this.appSet.removeUser('currentUser');
    }
}