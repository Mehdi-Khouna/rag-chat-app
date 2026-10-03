import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FileUploadResult } from '../../models/chat.models';

@Injectable({ providedIn: 'root' })
export class FilesApiService {
  private readonly http = inject(HttpClient);

  uploadFiles(conversationId: string, files: File[]): Observable<FileUploadResult[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.http.post<FileUploadResult[]>(
      `${environment.apiUrl}/conversations/${conversationId}/files`,
      formData,
    );
  }
}
