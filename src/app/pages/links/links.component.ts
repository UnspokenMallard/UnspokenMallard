import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import get from "lodash-es/get";
import includes from "lodash-es/includes";
import { LocalStorage } from 'ngx-store';
import { DataService } from "src/app/core/services/data.service";

@Component({
  selector: 'links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent {
  @ViewChild('stickyArea') stickyArea!: ElementRef;

  @LocalStorage() links: Link.Result[] = [];
  similarities = [
    {
      label: 'Exact',
      value: 'exact',
      selected: false,
    },
    {
      label: 'Broader',
      value: 'broader',
      selected: false,
    },
    {
      label: 'Narrower',
      value: 'narrower',
      selected: false,
    },
  ];

  conceptView = false;
  shrink = false;
  faFilter = faFilter;

  constructor(
    public data: DataService,
  ) {}

  ngAfterViewInit(): void {
    let lastChange = 0;

    let observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          const now = Date.now();

          const tooQuickToChangeAgain = now - lastChange <= 100;
          const isShrinked = this.shrink;
          const tooSmallToBother =
            !isShrinked &&
            document.documentElement.scrollHeight / window.innerHeight < 1.3; // == if document height < 1.3vh

          if (!tooQuickToChangeAgain && !tooSmallToBother) {
            this.shrink = !entry.isIntersecting;
            lastChange = now;
          }
        });
      },
      { rootMargin: '-1px 0px 0px 0px', threshold: [1.0] }
    );

    observer.observe(this.stickyArea.nativeElement);
  }

  public emitSourceDictionarySearch(items: Dictionary.Result[]) {
    this.data.sourceDict = get(items, "[0].id");
  }

  public emitLanguageSearch(items: Language.Result[]) {
    const codes = items.map(({code}) => code);
    for (const targetLanguage of this.data.targetLanguages) {
      targetLanguage.selected = includes(codes, targetLanguage.value.code);
    }
    this.data.targetLanguage = codes[0];
  }

  public emitTargetDictionarySearch(items: Dictionary.Result[]) {
    this.data.targetDict = get(items, "[0].id");
  }

  public emitSimilaritySearch(items: Similarity.Result[]) {
    this.data.similarity = get(items, "[0]");
  }

}
