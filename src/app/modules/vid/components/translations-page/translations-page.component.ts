import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {Translation} from "../../../../translation";
import {faFilter} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-translations-page',
  templateUrl: './translations-page.component.html',
  styleUrls: ['./translations-page.component.scss']
})
export class TranslationsPageComponent implements OnInit {

  @ViewChild('stickyArea') stickyArea!: ElementRef;

  public translations = this.getTranslations()
  public languages = this.getLanguages();
  public sourceDictionaries = this.getSourceDictionaries();
  public targetDictionaries = this.getTargetDictionaries();
  public similarities = this.getSimilarities();

  conceptView = false
  shrink = false
  faFilter = faFilter

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let lastChange = 0

    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const now = Date.now()

        const tooQuickToChangeAgain = (now - lastChange) <= 100
        const isShrinked = this.shrink
        const tooSmallToBother = !isShrinked && (document.documentElement.scrollHeight / window.innerHeight) < 1.3 // == if document height < 1.3vh

        if (!tooQuickToChangeAgain && !tooSmallToBother) {
          this.shrink = !entry.isIntersecting
          lastChange = now
        }
      })
    }, {rootMargin: '-1px 0px 0px 0px', threshold: [1.0]})

    observer.observe(this.stickyArea.nativeElement)
  }

  private getTranslations(): { source: Translation[], target: Translation[] }[] {
    return translations.links.map((item) => {
      return {
        source: [
          {
            id: item.sourceID,
            collection: {
              link: item.sourceURL,
              name: item.sourceDict
            },
            description: item.sourceDescription,
            term: item.sourceHeadword,
          }
        ],
        target: [
          {
            id: item.targetID,
            collection: {
              link: item.targetURL,
              name: item.targetDict
            },
            description: item.targetDescription,
            term: item.targetHeadword,
            similarity: item.targetSimilarity,
          },
        ],
      }
    })
  }

  private getLanguages(): { label: string, value: any, selected: boolean }[] {
    return languages.map((item) => {
      return {
        label: item.language ?? '',
        value: item,
        selected: false,
      }
    })
  }

  private getSourceDictionaries(): { label: string, value: any, selected: boolean }[] {
    return dictionaries.map((item) => {
      return {
        label: item.title ?? '',
        value: item,
        selected: false,
      }
    })
  }

  private getTargetDictionaries(): { label: string, value: any, selected: boolean }[] {
    return dictionaries.map((item) => {
      return {
        label: item.title ?? '',
        value: item,
        selected: false,
      }
    })
  }

  private getSimilarities(): { label: string, value: any, selected: boolean }[] {
    return [
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
    ]
  }
}

const dictionaries = [
  {
    "id": "elexis-zrcsazu-jsv",
    "title": "elexis ZRC SAZU JSV",
    "language": "sl",
    "hasLinks": true
  },
  {
    "id": "elexis-zrcsazu-pletersnik",
    "title": "elexis ZRCSAZU Pletersnik",
    "language": "sl",
    "hasLinks": true
  }
];

const languages = [
  {
    "code": "Dagaare",
    "language": null
  },
  {
    "code": "Karelian",
    "language": null
  },
  {
    "code": "ar",
    "language": "Arabic"
  },
  {
    "code": "be",
    "language": "Belarusian"
  },
  {
    "code": "bg",
    "language": "Bulgarian"
  },
  {
    "code": "ca",
    "language": "Catalan"
  },
  {
    "code": "cs",
    "language": "Czech"
  },
  {
    "code": "da",
    "language": "Danish"
  },
  {
    "code": "de",
    "language": "German"
  },
  {
    "code": "el",
    "language": "Modern Greek (1453-)"
  },
  {
    "code": "en",
    "language": "English"
  },
  {
    "code": "es",
    "language": "Spanish"
  },
  {
    "code": "et",
    "language": "Estonian"
  },
  {
    "code": "eu",
    "language": "Basque"
  },
  {
    "code": "fa",
    "language": "Persian"
  },
  {
    "code": "fi",
    "language": "Finnish"
  },
  {
    "code": "fr",
    "language": "French"
  },
  {
    "code": "hi",
    "language": "Hindi"
  },
  {
    "code": "hr",
    "language": "Croatian"
  },
  {
    "code": "hu",
    "language": "Hungarian"
  },
  {
    "code": "is",
    "language": "Icelandic"
  },
  {
    "code": "it",
    "language": "Italian"
  },
  {
    "code": "ja",
    "language": "Japanese"
  },
  {
    "code": "la",
    "language": "Latin"
  },
  {
    "code": "lt",
    "language": "Lithuanian"
  },
  {
    "code": "lv",
    "language": "Latvian"
  },
  {
    "code": "mk",
    "language": "Macedonian"
  },
  {
    "code": "mt",
    "language": "Maltese"
  },
  {
    "code": "nb",
    "language": "Norwegian Bokmål"
  },
  {
    "code": "nl",
    "language": "Dutch"
  },
  {
    "code": "nn",
    "language": "Norwegian Nynorsk"
  },
  {
    "code": "no",
    "language": "Norwegian"
  },
  {
    "code": "pl",
    "language": "Polish"
  },
  {
    "code": "pt",
    "language": "Portuguese"
  },
  {
    "code": "ro",
    "language": "Romanian"
  },
  {
    "code": "ru",
    "language": "Russian"
  },
  {
    "code": "sa",
    "language": "Sanskrit"
  },
  {
    "code": "sk",
    "language": "Slovak"
  },
  {
    "code": "sl",
    "language": "Slovenian"
  },
  {
    "code": "sr",
    "language": "Serbian"
  },
  {
    "code": "sv",
    "language": "Swedish"
  },
  {
    "code": "tr",
    "language": "Turkish"
  },
  {
    "code": "uk",
    "language": "Ukrainian"
  },
  {
    "code": "zh",
    "language": "Chinese"
  }
];

const translations = {
  "links": [
    {
      "sourceDict": "elexis-zrcsazu-jsv",
      "sourceHeadword": "miza",
      "sourceDescription": "kos pohištva",
      "sourceID": 4207,
      "sourceSense": "1",
      "sourceURL": "https://lexonomy.elex.is/elexis-zrcsazu-jsv/4207",
      "targetDict": "elexis-zrcsazu-pletersnik",
      "confidence": 1.0,
      "targetLang": "sl",
      "targetDictConcept": false,
      "targetHeadword": "miza ",
      "targetID": 33818,
      "targetSimilarity": "exact",
      "targetURL": "https://lexonomy.elex.is/elexis-zrcsazu-pletersnik/33818",
      "targetDescription": "",
      "sourceDictTitle": "Dictionary of the Slovenian Language in the Works of Janez Svetokriški",
      "targetDictTitle": "Slovenian-German Dictionary of Maks Pleteršnik (1894-1895)"
    },
    {
      "sourceDict": "elexis-zrcsazu-pletersnik",
      "sourceHeadword": "miza ",
      "sourceID": 33818,
      "sourceSense": "1",
      "sourceURL": "https://lexonomy.elex.is/elexis-zrcsazu-pletersnik/33818",
      "targetDict": "elexis-zrcsazu-jsv",
      "confidence": 1.0,
      "targetLang": "sl",
      "targetDictConcept": false,
      "targetHeadword": "miza ",
      "targetID": 4207,
      "targetDescription": "",
      "targetSimilarity": "broader",
      "targetURL": "https://lexonomy.elex.is/elexis-zrcsazu-jsv/4207",
      "sourceDictTitle": "Slovenian-German Dictionary of Maks Pleteršnik (1894-1895)",
      "targetDictTitle": "Dictionary of the Slovenian Language in the Works of Janez Svetokriški"
    }
  ],
  "success": true
}
