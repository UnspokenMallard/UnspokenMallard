import {Component, ElementRef, Input, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {faSearch, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  @Input('onHomeScreen') onHomeScreen: boolean = false
  @Input('shrink') shrink: boolean = false

  @ViewChild('input') inputElement!: ElementRef;

  faSearch = faSearch
  faTimes = faTimes

  form = this.formBuilder.group({
    language: '',
    query: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  onLanguageChange(lang: { code: string, language: string }): void {
    this.form.patchValue({'language': lang.code})
  }

  onSubmit(): void {
    console.log('Form has been submitted', this.form.value)
    if (this.form.value.language && this.form.value.query) {
      this.router.navigate(['translations', this.form.value.language, this.form.value.query])
    }
  }

  clearQuery(): void {
    this.form.patchValue({'query': ''})
    this.inputElement.nativeElement.focus()
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const queryFromRoute = routeParams.get('query');
    const langFromRoute = routeParams.get('lang');

    if (queryFromRoute) {
      this.form.patchValue({'query': queryFromRoute})
    }

    if (langFromRoute) {
      this.form.patchValue({'language': langFromRoute})
    }
  }

  ngAfterViewInit(): void {
    if (this.onHomeScreen) {
      this.inputElement.nativeElement.focus()
    }
  }
}
