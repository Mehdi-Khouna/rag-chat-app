import { Component, signal, output, input } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
  selector: 'app-chat-input',
  imports: [HlmButtonImports, HlmTextareaImports],
  templateUrl: './chat-input.html',
  styleUrl: './chat-input.css',
})
export class ChatInput {
  readonly isBusy = input(false);
  readonly querySubmitted = output<string>();

  readonly draft = signal('');

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  submit(): void {
    const value = this.draft().trim();
    if (!value || this.isBusy()) return;
    this.querySubmitted.emit(value);
    this.draft.set('');
  }
}