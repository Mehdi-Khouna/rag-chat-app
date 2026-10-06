import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConversationsApiService } from '../../../core/services/api/conversations-api.service';
import { FilesApiService } from '../../../core/services/api/files-api.service';
import { ChatApiService } from '../../../core/services/api/chat-api.service';
import { ChatMessage, FileUploadResult } from '../../../core/models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatStoreService {
  private readonly conversationsApi = inject(ConversationsApiService);
  private readonly filesApi = inject(FilesApiService);
  private readonly chatApi = inject(ChatApiService);

  private readonly _conversationId = signal<string | null>(null);
  private readonly _messages = signal<ChatMessage[]>([]);
  private readonly _uploadedFiles = signal<FileUploadResult[]>([]);
  private readonly _isStarting = signal(false);
  private readonly _isUploading = signal(false);
  private readonly _isAsking = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly conversationId = this._conversationId.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly uploadedFiles = this._uploadedFiles.asReadonly();
  readonly isStarting = this._isStarting.asReadonly();
  readonly isUploading = this._isUploading.asReadonly();
  readonly isAsking = this._isAsking.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasConversation = computed(() => this._conversationId() !== null);
  readonly hasFiles = computed(() => this._uploadedFiles().length > 0);
  readonly isBusy = computed(() => this._isStarting() || this._isUploading() || this._isAsking());

  async startConversation(): Promise<void> {
    this._isStarting.set(true);
    this._error.set(null);
    try {
      const res = await firstValueFrom(this.conversationsApi.createConversation());
      this._conversationId.set(res.conversationId);
      this._messages.set([]);
      this._uploadedFiles.set([]);
    } catch {
      this._error.set('Could not start a new conversation. Please try again.');
    } finally {
      this._isStarting.set(false);
    }
  }

  async uploadFiles(files: File[]): Promise<void> {
    const conversationId = this._conversationId();
    if (!conversationId) return;

    this._isUploading.set(true);
    this._error.set(null);
    try {
      const results = await firstValueFrom(this.filesApi.uploadFiles(conversationId, files));
      this._uploadedFiles.update((current) => [...current, ...results]);
    } catch {
      this._error.set('File upload failed. Please try again.');
    } finally {
      this._isUploading.set(false);
    }
  }

  async askQuestion(query: string): Promise<void> {
    const conversationId = this._conversationId();
    if (!conversationId || !query.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };
    this._messages.update((current) => [...current, userMessage]);

    this._isAsking.set(true);
    this._error.set(null);
    try {
      const res = await firstValueFrom(this.chatApi.ask(conversationId, query));
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toISOString(),
      };
      this._messages.update((current) => [...current, assistantMessage]);
    } catch {
      this._messages.update((current) => current.filter((m) => m !== userMessage));
      this._error.set('Could not get an answer. Please try again.');
    } finally {
      this._isAsking.set(false);
    }
  }
}
