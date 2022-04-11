import {Component, ElementRef, Input, OnInit, AfterViewInit, ViewChild, Inject} from '@angular/core';
import {faSearch, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import { DataService } from "src/app/core/services/data.service";
import { WINDOW } from "src/app/core/services/window.service";

@Component({
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, AfterViewInit {

  @Input('onHomeScreen') onHomeScreen: boolean = false
  @Input('shrink') shrink: boolean = false

  @ViewChild('input') inputElement!: ElementRef;

  faSearch = faSearch
  faTimes = faTimes

  form = this.formBuilder.group({
    sourceLanguage: '',
    headword: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  onLanguageChange(lang: Core.SelectableItem<Language.Result>): void {
    this.form.patchValue({'sourceLanguage': lang.value.code})
  }

  onSubmit(): void {
    if (this.form.value.sourceLanguage && this.form.value.headword) {
      let parameters = {} as Link.Parameters;
      if (!!this.data.sourceDict) {
        parameters.sourceDict = this.data.sourceDict;
      }
      if (!!this.data.targetLanguage) {
        parameters.targetLanguage = this.data.targetLanguage;
      }
      if (!!this.data.targetDict) {
        parameters.targetDict = this.data.targetDict;
      }
      if (!!this.data.similarity) {
        parameters.similarity = this.data.similarity;
      }
      const config = {
        queryParams: parameters,
      } as NavigationExtras;
      this.router.navigate(['links', this.form.value.sourceLanguage, this.form.value.headword], config);
    }

  }

  clear(): void {
    this.form.patchValue({'headword': ''});
    this.inputElement.nativeElement.focus();
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const headwordFromRoute = routeParams.get('headword');
    const langFromRoute = routeParams.get('sourceLanguage');

    if (headwordFromRoute) {
      this.form.patchValue({'headword': headwordFromRoute})
    }

    if (langFromRoute) {
      this.form.patchValue({'sourceLanguage': langFromRoute})
    }
  }

  ngAfterViewInit(): void {
    if (this.onHomeScreen) {
      this.inputElement.nativeElement.focus()
    }
  }
}
