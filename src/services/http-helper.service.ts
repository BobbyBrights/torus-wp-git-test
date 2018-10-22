import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpHelperService {
    constructor(
        private http: HttpClient
    ) {

    }

    httpPost(url: string, body: any, options?: any, isAzure?: boolean) {
        if (isAzure) {
            options.headers = new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            });
        }

        // dev mode url (note: remove it for production)
        url = `https://victor-dev-e-us-fa.azurewebsites.net${url}`;
       // url = `https://victor-dev-e-us-fa-attorney.azurewebsites.net${url}`;
        return this.http.post(url, body, options);
    }
}
