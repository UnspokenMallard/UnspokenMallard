import {Component, OnInit} from '@angular/core';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
import {DarkmodeService} from "../../services/darkmode.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  faMoon = faMoon;
  faSun = faSun;

  constructor(private darkmodeService: DarkmodeService) {
  }

  ngOnInit(): void {
  }

  isDarkModeOn() {
    return this.darkmodeService.isDarkModeOn
  }

  toggleDarkMode() {
    this.darkmodeService.toggleDarkMode()
  }

}
