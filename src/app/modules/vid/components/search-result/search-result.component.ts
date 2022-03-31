import {Component, Input, OnInit} from '@angular/core';
import {Translation} from "../../../../translation";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  @Input('items') items!: { source: Translation[], target: Translation[] }
  @Input('conceptView') conceptView = false

  counter = 3

  constructor() {
  }

  ngOnInit(): void {
  }

  showMore() {
    this.counter = Math.min(this.counter + 3, this.items.target.length)
  }
}
