import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent implements OnInit {
  @Input() titleName: string = '';
  @Input() additionalClass: string = '';
  @Input() canGoBack: boolean = false;

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goToPreviousPage() {
    this.location.back();
  }
}
