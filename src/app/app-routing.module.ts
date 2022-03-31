import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./modules/vid/components/home-page/home-page.component";
import {TranslationsPageComponent} from "./modules/vid/components/translations-page/translations-page.component";

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'translations/:lang/:query', component: TranslationsPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
