import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-inject-document-into-angular',
  templateUrl: './inject-document-into-angular.component.html',
  styleUrls: ['./inject-document-into-angular.component.scss']
})
export class InjectDocumentIntoAngularComponent implements OnInit {
  popcoordinatesNativeJS: any;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.getVanillaJsElement();
  }

  getVanillaJsElement() {
    this.popcoordinatesNativeJS = (<HTMLElement>document.getElementById('html-element'));
    // this.popcoordinatesNativeJS.textContent = 'test';
  }

}
