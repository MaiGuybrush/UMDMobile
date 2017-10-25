import {Injectable} from '@angular/core'
import {Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers} from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { ExtraInfoProvider } from '../providers/extrainfo-provider'

@Injectable()
export class InterceptedHttp extends Http {
  public token: string;
  constructor(backend: XHRBackend, options: RequestOptions, public tokenService:ExtraInfoProvider) {
    super(backend, options); 
  }
  refreshToken() : Observable<string> 
  {
    return this.tokenService.verifyWithAppID().map(
      m => m.accessToken
    );
  }
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>
  {
    let token = this.token;
    var me = this;
    if (!options) {
      // let's make option object
      options = {headers: new Headers()};
    }
    options.headers.set('Authorization', `Bearer ${token}`);
    if (!options.headers.get('Content-Type'))
    {
      options.headers.set('Content-Type', 'application/json');
    }
    //return super.request(url, options).catch(this.catchAuthError(this));
    return super.post(url, body, options)
    .catch(initialError => {
        if (initialError && initialError.status === 401) {
            // token might be expired, try to refresh token
            return me
              .refreshToken()
              //Use flatMap instead of map
              .mergeMap((token: string) => {
                    if (token != null && token != "") {
                      // retry with new token
                      me.token = token;
                      return this.post(url, body, options);
                    }
                    return Observable.throw(initialError);
                });
        }
        else {
            return Observable.throw(initialError);
        }
    });  
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    let token = this.token;
    var me = this;
    if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
      if (!options) {
        // let's make option object
        options = {headers: new Headers()};
      }
      options.headers.set('Authorization', `Bearer ${token}`);
    } 
    else 
    {
        // we have to add the token to the url object
        url.headers.set('Authorization', `Bearer ${token}`);
    }
    //return super.request(url, options).catch(this.catchAuthError(this));
    return super.request(url, options)
    .catch(initialError => {
        if (initialError && initialError.status === 401) {
            // token might be expired, try to refresh token
            return me
                  .refreshToken()
                  //Use flatMap instead of map
                  .mergeMap((token: string) => {
                        if (token != null && token != "") {
                          // retry with new token
                          me.token = token;
                          return this.request(url, options);
                        }
                        return Observable.throw(initialError);
                    });
        }
        else {
            return Observable.throw(initialError);
        }
    });  
  }

}