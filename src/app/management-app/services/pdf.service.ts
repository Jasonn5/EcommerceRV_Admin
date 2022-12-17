import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  public Open(pdf) {
    if (environment.SERVERLESS_DEPLOY) {
      let reader = new FileReader();
      reader.readAsText(pdf);
      reader.onloadend = function () {
        var data = reader.result.toString();
        var byteCharacters = atob(data);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var file = new Blob([byteArray], { type: 'application/pdf' + ';base64' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    }
    else {
      let url = window.URL.createObjectURL(pdf);
      window.open(url, '_blank');
    }
  }
}
