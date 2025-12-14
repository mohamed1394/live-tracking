import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LiveCoordsService } from './live-coords.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [LiveCoordsService],
  bootstrap: [AppComponent]
})
export class AppModule {}

