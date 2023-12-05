import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatModule } from './chat/chat.module';
import { ThreadComponent } from './chat/thread/thread.component';
import { ContentComponent } from './content/content.component';
import { HeaderComponent } from './header/header.component';
import { HomeRoutingModule } from './home-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    ContentComponent,
    SidebarComponent,
    ThreadComponent,
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
