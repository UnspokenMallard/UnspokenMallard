import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MihaModule} from "./modules/miha/miha.module";
import {OverlayModule} from "@angular/cdk/overlay";
import {VidModule} from "./modules/vid/vid.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FontAwesomeModule,
    MihaModule,
    OverlayModule,
    VidModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
