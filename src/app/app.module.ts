import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import  { PickerComponent }  from  '@ctrl/ngx-emoji-mart';
import { ErrorDialogComponent } from './shared/errors/error-dialog/error-dialog.component';
import { LoadingDialogComponent } from './shared/loading/loading-dialog/loading-dialog.component' ;
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    AuthenticationModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    PickerComponent,
    HttpClientModule,
    MaterialModule,
    CoreModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
