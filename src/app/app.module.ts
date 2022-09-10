import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { firebaseConfig } from './credentials';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { initializeApp } from 'firebase/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TaskService } from './services/task.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [
    {
    provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy
    },
    TaskService,
    AuthService], 
  bootstrap: [AppComponent],
})
export class AppModule {}
