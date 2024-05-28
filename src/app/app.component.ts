import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Buffer } from 'buffer';
import { CmcAtiPdf, sha256 } from 'cmcati-sign-pdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'test-sign';
  imageArrayBuffer!: ArrayBuffer;
  pdfArrayBuffer!: ArrayBuffer;
  imageB64 = '';
  pdfB64 = '';
  pdf = new CmcAtiPdf();

  constructor(private _http: HttpClient) {}
  ngOnInit(): void {}

  async onImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0) as File;
    this.imageB64 = await this.fileToB64(file);
    this.imageArrayBuffer = await this.fileToArrayBuffer(file);
  }

  async onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0) as File;
    this.pdfB64 = await this.fileToB64(file);
    this.pdfArrayBuffer = await this.fileToArrayBuffer(file);

    //Load PDF
    this.pdf.original = this.pdfB64;
  }

  async sign() {
    //Add placeholder to PDF and get hash to request external service
    const hash = await this.pdf.generateHexToBeSigned({
      x: 0,
      y: 0,
      width: 100,
      height: 200,
      signedBy: 'Nguyễn Tiến Hải Ninh',
      reason: 'Xin chào',
      location: 'Việt Nam',
      contactInfo: 'example@gmail.com',
      pageNumber: 1,
      hashAlgorithm: sha256,
      background: this.imageB64,
      fieldName: 'Ninh',
    });

    //Request external service
    this._http
      .post<{
        signature: string;
        certificate: string;
        signAlgorithmOid: string;
      }>('http://localhost:8080/signHash', {
        hashValue: Buffer.from(hash, 'hex').toString('base64'),
        hashAlgorithm: this.pdf.hashAlgorithm.oid,
      })
      .subscribe((res) => {
        //Sign
        this.pdf.sign({
          signature: Buffer.from(res.signature, 'base64').toString('hex'),
          encryptionAlgorithmOid: res.signAlgorithmOid,
          certificate: res.certificate,
        });

        const url = window.URL.createObjectURL(new Blob([this.pdf.signed]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'download.pdf';
        a.click();
        a.remove();
      });
  }

  fileToB64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  }

  fileToArrayBuffer(file: File) {
    return file.arrayBuffer();
  }
}
