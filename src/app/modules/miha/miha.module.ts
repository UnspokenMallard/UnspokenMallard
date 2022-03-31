import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateCardComponent } from './components/translate-card/translate-card.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { SmartDropdownComponent } from './components/smart-dropdown/smart-dropdown.component';
import {OverlayModule} from "@angular/cdk/overlay";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    TranslateCardComponent,
    SmartDropdownComponent
  ],
  exports: [
    TranslateCardComponent,
    SmartDropdownComponent
  ],
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule,
    FontAwesomeModule,
  ]
})
export class MihaModule { }
