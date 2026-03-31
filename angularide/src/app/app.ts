import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ide } from "./ide/ide";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Ide],
  templateUrl: './app.html',
  template: `<app-ide></app-ide>`,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angularide');
}
