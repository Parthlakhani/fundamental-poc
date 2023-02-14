import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fundamental-poc';
  subListOpen = false;
  subRootOpen = false;

  toggleChildList() {
    this.subListOpen = !this.subListOpen;
  }

  toggleRoot() {
    this.subRootOpen = !this.subRootOpen;
  }
}
