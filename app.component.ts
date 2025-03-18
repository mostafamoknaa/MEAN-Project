import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UploadimagesService } from './uploadimages.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'upload_images';

  selectedFile: File | null = null;
  imageUrl: string | null = null;

  constructor(private uploadService: UploadimagesService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('File selected:', this.selectedFile); 
  }


  onUpload(): void {
    if (this.selectedFile) {
      this.uploadService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          console.log('Backend response:', response); 
          this.imageUrl = `http://localhost:3000${response.filePath}`;
          console.log('Image URL set to:', this.imageUrl); 
        },
        error: (err) => {
          console.error('Upload failed:', err); 
        }
      });
    }
  }
}
