import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isEmpty, isNil } from 'lodash-es';
import {
  CookieStorage,
  CookieStorageService,
  LocalStorage,
  LocalStorageService,
} from 'ngx-store';
import { iif, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  @LocalStorage() private info!: null | User.Information;
  @CookieStorage('email') @LocalStorage() private email!: null | string;
  @CookieStorage('sessionkey') @LocalStorage() private sessionkey!:
    | null
    | string;

  constructor(
    private httpClient: HttpClient,
    private cookieStorage: CookieStorageService,
    private localStorage: LocalStorageService
  ) {}

  signup$(email: string) {
    const formData = new FormData();
    formData.append('email', email);
    return this.httpClient
      .post<Core.BaseResponse>('/signup.json', formData)
      .pipe(
        map(({ success }) => success),
        catchError(() => of(false))
      );
  }

  login$(email: string, password: string): Observable<boolean> {
    if (isEmpty(email) || isEmpty(password)) return of(false);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    return this.httpClient
      .post<Core.LoginResponse>('/login.json', formData)
      .pipe(
        map(({ success, sessionkey }) => {
          if (success && !!sessionkey) {
            this.email = email;
            this.sessionkey = sessionkey;
          }
          return success;
        }),
        mergeMap((success) => {
          return iif(() => success, this.profile$(), of(false));
        }),
        catchError(() => of(false))
      );
  }

  logout$(): Observable<void> {
    this.cookieStorage.clear();
    this.localStorage.clear();
    return this.httpClient.get('/logout').pipe(
      map(() => undefined),
      catchError(() => of(undefined))
    );
  }

  get profile() {
    return this.info;
  }

  profile$() {
    return this.httpClient.get<User.Information>('/userprofile.json').pipe(
      map((info) => {
        const success = !!info;
        if (success) {
          this.info = info;
        }
        return success;
      })
    );
  }

  isLogged(profile = this.profile): profile is User.Information {
    return !isNil(this.email) && !isNil(this.sessionkey);
  }
}
