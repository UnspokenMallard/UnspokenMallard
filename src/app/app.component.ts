import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loading = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.navigationStart$.subscribe(() => {
      this.loading = true;
    });
    this.navigationEnd$.subscribe(() => {
      this.loading = false;
    });
  }

  private get navigationStart$() {
    return (this.router.events as Observable<RouterEvent>).pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart)
    );
  }

  private get navigationEnd$() {
    return (this.router.events as Observable<RouterEvent>).pipe(
      filter((event: RouterEvent) => {
        return (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        );
      })
    );
  }
}
