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
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronUp,
  faMagnifyingGlass,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import cloneDeep from 'lodash-es/cloneDeep';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'smart-dropdown',
  templateUrl: './smart-dropdown.component.html',
  styleUrls: ['./smart-dropdown.component.scss'],
})
export class SmartDropdownComponent implements OnInit, OnDestroy, OnChanges {
  @Input('title') title!: string;

  @Input('noBackground') noBackground: boolean = false;

  @Input('searchPlaceholder') searchPlaceholder: any;

  @Input('singleItemMode') singleItemMode: boolean = true;

  @Input('items') items: Core.SelectableItem[] = [];

  @Output('change') change = new EventEmitter<any[]>();

  @Input('isOpen') isOpen = false;
  @Output('isOpenChange') isOpenChange: EventEmitter<boolean> = new EventEmitter();

  filteredItems: Core.SelectableItem[] = [];

  text$: Subject<string> = new Subject<string>();

  search$: Observable<string>;

  selectedValues: any[] = [];


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
      debounceTime(200)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.filteredItems = cloneDeep(changes['items'].currentValue);
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

  get selectedTitle() {
    if (this.singleItemMode) {
      const selectedTitle = this.selected.length === 1 ? this.selected[0].label : "";
      return selectedTitle.length > 0 ? selectedTitle : this.title;
    } else {
      return this.title;
    }
  }

  onInputChange(query: string) {
    this.text$.next(query);
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  toggleItem(item: Core.SelectableItem) {
    if (this.singleItemMode && this.isSelected(item)) return;
    item.selected = !item.selected;
    for (const selectableItem of this.items) {
      if (selectableItem.label === item.label) {
        selectableItem.selected = item.selected;
      }
    }
    const items = this.filteredItems.filter((s) => s.selected).map((s) => s.value);
    this.change.emit(items);
  }

  isSelected(item: Core.SelectableItem) {
    if (!this.singleItemMode) return false;
    return !item.selected && this.selected.length === 1;
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
    this.isOpenChange.emit(false);
  }
}
