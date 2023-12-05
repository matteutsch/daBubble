import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ChatModule } from './chat/chat.module';
import { HeaderComponent } from './header/header.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ThreadComponent } from './chat/thread/thread.component';
import { MainChatComponent } from './chat/main-chat/main-chat.component';

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    SidebarComponent,
    ThreadComponent,
    MainChatComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ChatModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSidenavModule,
  ],
})
export class HomeModule {}
