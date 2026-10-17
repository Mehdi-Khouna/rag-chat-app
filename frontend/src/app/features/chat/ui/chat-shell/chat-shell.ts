import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ChatStoreService } from '../../data-access/chat-store.service';
import { FileUpload } from '../file-upload/file-upload';
import { MessageList } from '../message-list/message-list';
import { ChatInput } from '../chat-input/chat-input';

@Component({
  selector: 'app-chat-shell',
  imports: [HlmButtonImports, FileUpload, MessageList, ChatInput],
  templateUrl: './chat-shell.html',
  styleUrl: './chat-shell.css',
})
export class ChatShell {
  protected readonly store = inject(ChatStoreService);

  onFilesSelected(files: File[]): void {
    this.store.uploadFiles(files);
  }

  onQuerySubmitted(query: string): void {
    this.store.askQuestion(query);
  }
}