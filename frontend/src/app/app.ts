import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatShell } from './features/chat/ui/chat-shell/chat-shell';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatShell],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App {}