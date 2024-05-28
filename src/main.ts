import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { config } from 'cmcati-sign-pdf';

//Lincense
config.license =
  'ZXlKbGJXRnBiQ0k2SW01bmRYbGxiblJwWlc1b1lXbHVhVzVvUUdkdFlXbHNMbU52YlNJc0luWmhiR2xrUm5KdmJTSTZNVGN4TmpnMk16WTJNVGM1Tnl3aWRtRnNhV1JVYnlJNk1UY3lNakEwTnpZMk1UYzVOMzA9O0xLUWJMa01xSEJjVENsMU1GSHJvQzFwRTAzWjdPM3ZJTCtyTGRmZ2FKcmNJRk51RFV6TzlIbDEvMC9hcm1TTFZqVlVCSGRvTGFxNktwYThMUlhJTUhHcnJZaG5YVDVjLy9TMU83ZTJ1ZEhJNHNFcnZ3Q0d1OGRhbGNoV2ZMVVB5Y1Rpa29NdTc1NHlzZ1QrNkVkcHdPd25GS1FHQS9oUTNRZmtvKy91UUh3Zz07TUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FDVlQyNDhsK3FPYUdBaml2b2VabVp2cEU3bitYMGZuSmRZQ3Y2cGgxUG04bnlQZHlOTkZWSy9RdG84OEMwUndCajRQczlCckE0bFN5SDFld0pMUEJJbjRnQkJLUm5BTFVrTVNrc0dEOEF3ako1Y0QyUEFoN24vbDg5Z2IwaGtQT0thcjhQajFlWnVEdmQ4OWVZN3lKUkxHdlBjN0Q0c21rTHRnbzNnQlY2aUxRSURBUUFC';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
