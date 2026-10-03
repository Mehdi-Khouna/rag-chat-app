import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateConversationResponse } from '../../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ConversationsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/conversations`;

  createConversation(): Observable<CreateConversationResponse> {
    return this.http.post<CreateConversationResponse>(this.baseUrl, {});
  }
}
