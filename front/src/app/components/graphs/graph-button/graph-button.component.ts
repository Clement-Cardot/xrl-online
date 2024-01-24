import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-graph-button',
  templateUrl: './graph-button.component.html',
  styleUrls: ['./graph-button.component.scss']
})
export class GraphButtonComponent {

  @ViewChild("downloadButton") downloadButton!: ElementRef;
  @ViewChild("tooltip") tooltip!: MatTooltip;

  constructor() { }

  showButton() {
    this.downloadButton.nativeElement.style.display = "block";
  }

  hideButton() {
    this.downloadButton.nativeElement.style.display = "none";
  }

  addClick(listener: EventListenerOrEventListenerObject) {
    this.downloadButton.nativeElement.addEventListener('click', listener);
    this.downloadButton.nativeElement.addEventListener('click', () => {
      this.tooltip.hideDelay = 1500;
      this.tooltip.show();
      setTimeout(() => {
        this.tooltip.hide();
      }, 1500);
    });
  }
}

