import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConversationsApiService } from './core/services/api/conversations-api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  private readonly conversationsApi = inject(ConversationsApiService);

  constructor() {
    this.conversationsApi.createConversation().subscribe((res) => {
      console.log('Created conversation:', res);
    });
  }
}