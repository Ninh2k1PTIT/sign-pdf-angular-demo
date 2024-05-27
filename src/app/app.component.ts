import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'test-sign';
  image = '';

  constructor(private _http: HttpClient) {}
  ngOnInit(): void {}

  async onImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0) as File;
    const reader = new FileReader();
    reader.onloadend = () => {
      this.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    const buffer = (await files?.item(0)?.arrayBuffer()) as ArrayBuffer;
    const externalSignPdf = require('cmcati-sign-pdf-1');
    externalSignPdf.config.license =
      'ZXlKbGJXRnBiQ0k2SW01bmRYbGxiblJwWlc1b1lXbHVhVzVvUUdkdFlXbHNMbU52YlNJc0luWmhiR2xrUm5KdmJTSTZNVGN4TmpjNU1qTTBNek14Tml3aWRtRnNhV1JVYnlJNk1UY3lOVFF6TWpNME16TXhObjA9O2c2NWtQSDBCK2ZUamh0SFJHUFo5aXE0VmxqRnVNaVplcjJheGtKNjU2NTFwMVRkU1oxdUoyWEQ2MXhrd1QrS0g1bi9BOEZ6RkZ4dVc4SXZzNUZFYVFNa3dCMUdpVytPYWNYTGQwTlNvZkdaV3lMNFN5RjdqeWRxMVRlYjdXRjNkbG4wYUNxWVJtWVZQWnB1M2xzWTRMSENZU2ZzTEIxZ1lGczNQbWtBdGVMZz07TUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FDVlQyNDhsK3FPYUdBaml2b2VabVp2cEU3bitYMGZuSmRZQ3Y2cGgxUG04bnlQZHlOTkZWSy9RdG84OEMwUndCajRQczlCckE0bFN5SDFld0pMUEJJbjRnQkJLUm5BTFVrTVNrc0dEOEF3ako1Y0QyUEFoN24vbDg5Z2IwaGtQT0thcjhQajFlWnVEdmQ4OWVZN3lKUkxHdlBjN0Q0c21rTHRnbzNnQlY2aUxRSURBUUFC';

    //Init PDF
    const pdf = new externalSignPdf.CmcAtiPdf();
    pdf.original = Buffer.from(buffer);
    // const pdf = new Pdf(fs.readFileSync("./outputs/pdf-signed.pdf"));

    //Add placeholder to PDF and get hash to request external service
    const hash = await pdf.generateHexToBeSigned({
      x: 200,
      y: 300,
      width: 100,
      height: 200,
      signedBy: 'Nguyễn Tiến Hải Ninh',
      reason: 'Xin chào',
      location: 'Việt Nam',
      contactInfo: 'example@gmail.com',
      pageNumber: 1,
      hashAlgorithm: externalSignPdf.sha256,
      background: this.image,
    });

    this._http
      .post<{
        signature: string;
        certificate: string;
        signAlgorithmOid: string;
      }>('http://localhost:8080/signHash', {
        hashValue: Buffer.from(hash, 'hex').toString('base64'),
        hashAlgorithm: pdf.hashAlgorithm.oid,
      })
      .subscribe((res) => {
        pdf.sign({
          signature: Buffer.from(res.signature, 'base64').toString('hex'),
          encryptionAlgorithmOid: res.signAlgorithmOid,
          certificate: res.certificate,
        });

        const url = window.URL.createObjectURL(new Blob([pdf.signed]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'download.pdf';
        a.click();
        a.remove();
      });
  }
}
