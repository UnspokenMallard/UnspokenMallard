import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-language-picker',
  templateUrl: './language-picker.component.html',
  styleUrls: ['./language-picker.component.scss']
})
export class LanguagePickerComponent implements OnInit {

  @Input('selectedLangCode') selectedLangCode: any
  @Output('change') change = new EventEmitter<{ code: string, language: string }>();

  isOpen = false
  languages = this.getLanguages()

  faChevronDown = faChevronDown
  faChevronUp = faChevronUp

  constructor() {
  }

  ngOnInit(): void {
  }

  openLanguagePicker() {
    this.isOpen = !this.isOpen
  }

  closeLanguagePicker() {
    this.isOpen = false
  }

  selectLanguage(language: { code: string, language: any }) {
    this.isOpen = false;
    this.selectedLangCode = language.code
    this.change.emit(language);
  }

  getSelectedLanguage() {
    const selectedLang = languages.find(lang => lang.code === this.selectedLangCode)

    return selectedLang ? selectedLang.language : "Language"
  }

  private getLanguages(): { code: string, language: string }[] {
    return languages
  }

}

const languages = [
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
