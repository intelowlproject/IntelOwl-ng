import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'intelowl-image-visualizer',
  template: '<img src="{{imgSrc}}">',
})
export class ImageVisualizerComponent implements OnInit {
  @Input() imageResult: string;
  public imgSrc: string;

  constructor() {}

  ngOnInit(): void {
    let imgSrc: string = 'data:image/jpg;base64,';
    try {
      window.atob(this.imageResult);
      imgSrc += this.imageResult; // img is base64
    } catch {
      imgSrc = this.imageResult; // img is url
    }
    this.imgSrc = imgSrc;
  }
}
