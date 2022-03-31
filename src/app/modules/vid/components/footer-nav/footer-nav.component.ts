import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss']
})
export class FooterNavComponent implements OnInit {

  @Input('color') color!: string;

  items = [
    {
      label: 'About us',
      url: '#'
    },
    {
      label: 'Support',
      url: '#',
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
