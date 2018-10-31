import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

// Add your project credentials
// Then use it in the imports section below
const yourFirebaseConfig = {
    apiKey: 'AIzaSyAbDgY2uRP5yYEBdiwHjbX2QW6UweMABMY',
    authDomain: 'hudz-prayer-calendar.firebaseapp.com',
    databaseURL: 'https://hudz-prayer-calendar.firebaseio.com',
    projectId: 'hudz-prayer-calendar',
    storageBucket: 'hudz-prayer-calendar.appspot.com',
    messagingSenderId: '761721867628'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(yourFirebaseConfig),
    AngularFireAuthModule, 
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
