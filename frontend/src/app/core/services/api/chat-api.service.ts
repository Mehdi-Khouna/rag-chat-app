import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AskResponse, ChatMessage } from '../../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private readonly http = inject(HttpClient);

  ask(conversationId: string, query: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(
      `${environment.apiUrl}/conversations/${conversationId}/messages/ask`,
      { query },
    );
  }

  getMessages(conversationId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(
      `${environment.apiUrl}/conversations/${conversationId}/messages`,
    );
  }
}
