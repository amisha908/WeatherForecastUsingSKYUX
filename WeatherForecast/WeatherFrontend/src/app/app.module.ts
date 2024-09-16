import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherWidgetComponent } from './weather-widget/weather-widget.component';
import { HttpClientModule } from '@angular/common/http';
import { SkyPageModule } from '@skyux/pages';
import { SkyLabelModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyVerticalTabsetModule } from '@skyux/tabs'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyBoxModule } from '@skyux/layout';
import { SkyInputBoxModule } from '@skyux/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyToastModule } from '@skyux/toast';

@NgModule({
  declarations: [
    AppComponent,
    WeatherWidgetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SkyPageModule,
    SkyLabelModule,
    SkyThemeModule,
    SkyAlertModule,
    SkyBoxModule,
    SkyVerticalTabsetModule,
    SkyRepeaterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SkyFluidGridModule,
    SkyInputBoxModule,
    FormsModule,
    ReactiveFormsModule,
    SkyToastModule
    
   
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
