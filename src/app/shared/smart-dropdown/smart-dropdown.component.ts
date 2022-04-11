import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {faSquare, faSquareCheck} from '@fortawesome/free-regular-svg-icons';
import {faChevronUp, faMagnifyingGlass, faTimes} from '@fortawesome/free-solid-svg-icons';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';
import cloneDeep from "lodash-es/cloneDeep";
import { debounceTime, Observable, Subject, takeUntil } from "rxjs";

@Component({
  selector: 'smart-dropdown',
  templateUrl: './smart-dropdown.component.html',
  styleUrls: ['./smart-dropdown.component.scss']
})
export class SmartDropdownComponent implements OnInit, OnDestroy, OnChanges {

  @Input('title') title!: string;

  @Input('searchPlaceholder') searchPlaceholder: any;

  @Input('items') items: { label: string, value: any, selected: boolean }[] = [];

  @Output('change') change = new EventEmitter<any[]>();

  filteredItems: { label: string, value: any, selected: boolean }[] = [];

  text$: Subject<string> = new Subject<string>();

  search$: Observable<string>;

  selectedValues: any[] = [];

  isOpen = false;

  q = '';

  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faLookup = faMagnifyingGlass;
  faSquareCheck = faSquareCheck;
  faSquare = faSquare;
  faMarks = faTimes;
  private readonly onDestroy$ = new Subject<boolean>();

  constructor() {
    this.search$ = this.text$.pipe(
      takeUntil(this.onDestroy$),
      debounceTime(200),
    )
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["items"]) {
      this.filteredItems = cloneDeep(changes["items"].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
}

  ngOnInit(): void {
    this.search$.subscribe((value) => {
      this.filteredItems = this.filter(value);
    });
  }

  onInputChange(query: string) {
    this.text$.next(query);
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  toggleItem(item: Core.SelectableItem) {
    item.selected = !item.selected;
    this.change.emit(this.filteredItems.filter(s => s.selected).map(s => s.value));
  }

  filter(query: string) {
    return this.items.filter((s) => {
      return s.label.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
  }

  get selected() {
    return this.filteredItems.filter((s) => s.selected);
  }

  close() {
    this.isOpen = false;
  }
}
