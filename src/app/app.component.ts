import { Component, ElementRef, ViewChild } from '@angular/core';
declare var LeaderLine: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('startingElement') startingElement: ElementRef | undefined;
  @ViewChild('endingElement') endingElement: ElementRef | undefined;

  title = 'fundamental-poc';
  subListOpen = false;
  subRootOpen = false;

  ngAfterViewInit() {
    const line = new LeaderLine(
      this.startingElement?.nativeElement,
      this.endingElement?.nativeElement
    );
  }

  toggleChildList() {
    this.subListOpen = !this.subListOpen;
  }

  toggleRoot() {
    this.subRootOpen = !this.subRootOpen;
  }
}
