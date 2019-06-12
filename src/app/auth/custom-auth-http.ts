import { Injectable } from '@angular/core';
import { Http, Request, Response, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp as JwtAuthHttp, AuthConfig } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CustomAuthHttp {

  constructor(private authHttp: JwtAuthHttp, private router: Router) {
  }

  private isUnauthorized(status: number): boolean {
    return status === 0 || status === 401;
  }

  private authIntercept(response: Observable<Response>): Observable<Response> {
    var sharableResponse = response.share()
    sharableResponse.subscribe(null, (err) => {
      if (this.isUnauthorized(err.status)) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
      // Other error handling may be added here, such as refresh token …
    });
    return sharableResponse;
  }
  public setGlobalHeaders(headers: Array<Object>, request: Request | RequestOptionsArgs) {
    this.authHttp.setGlobalHeaders(headers, request);
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.request(url, options));
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.get(url, options));
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.post(url, body, options));
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.put(url, body, options));
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.delete(url, options));
  }

  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.patch(url, options));
  }

  public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.head(url, options));
  }

  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.options(url, options));
  }
}
