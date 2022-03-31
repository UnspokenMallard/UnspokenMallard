import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HomePageComponent} from './components/home-page/home-page.component';
import {FooterNavComponent} from './components/footer-nav/footer-nav.component';
import {TranslationsPageComponent} from './components/translations-page/translations-page.component';
import {HeaderComponent} from './components/header/header.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FooterComponent} from './components/footer/footer.component';
import {MihaModule} from "../miha/miha.module";
import {FiltersComponent} from './components/filters/filters.component';
import {SearchBoxComponent} from './components/search-box/search-box.component';
import {OverlayModule} from "@angular/cdk/overlay";
import {LanguagePickerComponent} from './components/language-picker/language-picker.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SearchResultComponent } from './components/search-result/search-result.component';


@NgModule({
  declarations: [
    HomePageComponent,
    FooterNavComponent,
    TranslationsPageComponent,
    HeaderComponent,
    FooterComponent,
    FiltersComponent,
    SearchBoxComponent,
    LanguagePickerComponent,
    SearchResultComponent,
  ],
  exports: [
    HomePageComponent,
    TranslationsPageComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MihaModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class VidModule {
}
