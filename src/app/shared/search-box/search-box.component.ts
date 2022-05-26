import {
  Component,
  ElementRef,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import first from 'lodash-es/first';
import get from 'lodash-es/get';

@Component({
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit, AfterViewInit {
  @Input('onHomeScreen') onHomeScreen: boolean = false;
  @Input('shrink') shrink: boolean = false;

  @ViewChild('input') inputElement!: ElementRef;
  isLanguagePickerOpen!: boolean;
  sourceLanguage!: Language.Result;
  faSearch = faSearch;
  faTimes = faTimes;

  form = this.formBuilder.group({
    sourceLanguage: '',
    headword: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    public data: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onLanguageChange(lang: Language.Result[]): void {
    this.sourceLanguage = first(lang) as Language.Result;
    this.form.patchValue({ sourceLanguage: get(this.sourceLanguage, 'code', '') });
    this.form.value.sourceLanguage ? this.form.enable() : this.form.disable();
  }

  onSubmit(): void {
    if (
      !this.isLanguagePickerOpen &&
      this.form.value.sourceLanguage &&
      this.form.value.headword
    ) {
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
    this.form.patchValue({ headword: '' });
    this.inputElement.nativeElement.focus();
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const headwordFromRoute = routeParams.get('headword');
    const langFromRoute = routeParams.get('sourceLanguage');
    if (this.onHomeScreen && !headwordFromRoute) {
      this.form.disable();
    }
    if (headwordFromRoute) {
      this.form.patchValue({ headword: headwordFromRoute });
    }

    if (langFromRoute) {
      for (const language of this.data.sourceLanguages) {
        if (language.value.code === langFromRoute) {
          language.selected = true;
          this.sourceLanguage = language.value;
          break;
        }
      }
      this.form.patchValue({ sourceLanguage: langFromRoute });
    }
  }

  ngAfterViewInit(): void {
    if (this.onHomeScreen) {
      this.inputElement.nativeElement.focus();
    }
  }
}
