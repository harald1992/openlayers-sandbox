import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { InjectDocumentIntoAngularComponent } from './components/inject-document-into-angular/inject-document-into-angular.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    InjectDocumentIntoAngularComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
