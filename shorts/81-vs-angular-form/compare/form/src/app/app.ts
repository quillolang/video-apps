import { Component, signal } from '@angular/core';
import {
  FormControl, FormGroup,
  ReactiveFormsModule, Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  form = new FormGroup({
    email: new FormControl('', [
      Validators.required, Validators.email,
    ]),
    age: new FormControl<number | null>(null, [
      Validators.required, Validators.min(13),
    ]),
  });
  joined = signal('');

  join() {
    this.joined.set(this.form.value.email ?? '');
  }
}
