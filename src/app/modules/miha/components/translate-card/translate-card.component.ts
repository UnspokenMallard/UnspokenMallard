import {Component, Input, OnInit} from '@angular/core';
import {faLink, faEllipsis} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-translate-card',
  templateUrl: './translate-card.component.html',
  styleUrls: ['./translate-card.component.scss']
})
export class TranslateCardComponent implements OnInit {

  @Input('translation') translation!: any;

  faLink = faLink;
  faEllipsis = faEllipsis;

  expanded = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  getSimilarityColor(): string {
    switch (this.translation.similarity) {
      case 'exact':
        return 'bg-similarity-exact';
      case 'broader':
        return 'bg-similarity-broader';
      case 'narrower':
        return 'bg-similarity-narrower';
      default:
        return 'bg-similarity-exact';
    }
  }
}
