import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-form-builder',
  templateUrl: './edit-form-builder.component.html',
  styleUrls: ['./edit-form-builder.component.scss'],
})
export class EditFormBuilderComponent {
  form_id: number;
  constructor(private route: ActivatedRoute) {
    this.form_id = route.snapshot.params['id'];
  }
}
