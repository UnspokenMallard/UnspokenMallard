import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output, ViewChild
} from '@angular/core';
import {faSquare, faSquareCheck} from '@fortawesome/free-regular-svg-icons';
import {faChevronUp, faMagnifyingGlass, faTimes} from '@fortawesome/free-solid-svg-icons';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-smart-dropdown',
  templateUrl: './smart-dropdown.component.html',
  styleUrls: ['./smart-dropdown.component.scss']
})
export class SmartDropdownComponent {

  @Input('title') title!: string;

  @Input('searchPlaceholder') searchPlaceholder: any;

  @Input('items') items: { label: string, value: any, selected: boolean }[] = [];

  @Output('change') change = new EventEmitter<any[]>();

  selectedValues: any[] = [];

  isOpen = false;

  q = '';

  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faLookup = faMagnifyingGlass;
  faSquareCheck = faSquareCheck;
  faSquare = faSquare;
  faMarks = faTimes;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  toggleItem(item: any) {
    item.selected = !item.selected;
    this.change.emit(this.items.filter(s => s.selected).map(s => s.value));
  }

  filter(items: any[]) {
    return items.filter((s) => {
      return s.label.toLowerCase().indexOf(this.q.toLowerCase()) !== -1;
    });
  }

  selected(items: any[]) {
    return items.filter((s) => s.selected);
  }

  close() {
    this.isOpen = false;
  }
}
