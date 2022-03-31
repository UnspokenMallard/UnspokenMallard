import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faFilter, faArrowRotateRight, faToggleOff, faToggleOn} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  @Input('dictionaries') dictionaries: { label: string, value: any, selected: boolean }[] = [];
  @Input('languages') languages: { label: string, value: any, selected: boolean }[] = [];
  @Input('similarities') similarities: { label: string, value: any, selected: boolean }[] = [];
  @Input('showConceptViewToggle') showConceptViewToggle = false

  @Output('conceptViewToggled') conceptViewToggled = new EventEmitter<boolean>();

  faFilter = faFilter;
  faArrowRotateRight = faArrowRotateRight;
  faToggleOff = faToggleOff;
  faToggleOn = faToggleOn;

  clearButtonEnabled = false
  conceptView = false

  constructor() {
  }

  ngOnInit(): void {
    this.checkClearButton()
  }

  onDropdownChange(type: string, $event: any[]) {
    this.checkClearButton()

    console.log(type, $event);
  }

  toggleConceptView() {
    this.conceptView = !this.conceptView
    this.conceptViewToggled.emit(this.conceptView)
  }

  checkClearButton() {
    if (this.hasSelectedItems(this.dictionaries)) {
      this.clearButtonEnabled = true

    } else if (this.hasSelectedItems(this.languages)) {
      this.clearButtonEnabled = true

    } else if (this.hasSelectedItems(this.similarities)) {
      this.clearButtonEnabled = true

    } else {
      this.clearButtonEnabled = false
    }
  }

  hasSelectedItems(items: { selected: boolean }[]) {
    if (items.length <= 0) return false;

    return items.some(el => el.selected)
  }

  clear() {
    this.dictionaries.map(el => el.selected = false)
    this.languages.map(el => el.selected = false)
    this.similarities.map(el => el.selected = false)

    this.clearButtonEnabled = false
  }
}
