import { Component, computed, input } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { ChatMessage } from '../../../../core/models/chat.models';

@Component({
  selector: 'app-message-bubble',
  imports: [HlmAvatarImports],
  templateUrl: './message-bubble.html',
  styleUrl: './message-bubble.css',
})
export class MessageBubble {
  readonly message = input.required<ChatMessage>();
  readonly isUser = computed(() => this.message().role === 'user');
}