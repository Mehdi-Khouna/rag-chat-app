import { Component, input, output, viewChild, ElementRef, signal } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { FileUploadResult } from '../../../../core/models/chat.models';

@Component({
  selector: 'app-file-upload',
  imports: [HlmCardImports, HlmButtonImports],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
})
export class FileUpload {
  readonly uploadedFiles = input<FileUploadResult[]>([]);
  readonly isUploading = input(false);

  readonly filesSelected = output<File[]>();

  private readonly addMoreInput = viewChild<ElementRef<HTMLInputElement>>('addMoreInput');

  readonly isDraggingOver = signal(false);

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.filesSelected.emit(Array.from(input.files));
    input.value = '';
  }

  triggerAddMore(): void {
    this.addMoreInput()?.nativeElement.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver.set(true);
  }

  onDragLeave(): void {
    this.isDraggingOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver.set(false);
    const files = event.dataTransfer?.files;
    if (!files?.length) return;
    this.filesSelected.emit(Array.from(files));
  }
}