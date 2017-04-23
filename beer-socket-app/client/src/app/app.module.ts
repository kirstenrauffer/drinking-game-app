import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { Angular2TokenService } from 'angular2-token';
import { CookieService } from 'angular2-cookie/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  providers: [
    Angular2TokenService,
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
