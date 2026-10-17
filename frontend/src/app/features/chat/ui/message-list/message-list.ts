import { Component, input, effect, viewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { MessageBubble } from '../message-bubble/message-bubble';
import { TypingIndicator } from '../typing-indicator/typing-indicator';
import { ChatMessage } from '../../../../core/models/chat.models';

@Component({
  selector: 'app-message-list',
  imports: [NgScrollbar, HlmScrollAreaImports, MessageBubble, TypingIndicator],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList {
  readonly messages = input<ChatMessage[]>([]);
  readonly isThinking = input(false);

  private readonly scrollbarRef = viewChild<NgScrollbar>('scrollbar');

  constructor() {
    effect(() => {
      this.messages();
      this.isThinking();
      queueMicrotask(() => this.scrollbarRef()?.scrollTo({ bottom: 0 }));
    });
  }
}