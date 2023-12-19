import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatChannelComponent } from './chat-channel/chat-channel.component';
import { ChatMessageComponent } from './shared-components/chat-message/chat-message.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { ChatDirectMessagesComponent } from './chat-direct-messages/chat-direct-messages.component';
import { MatCardModule } from '@angular/material/card';
import { CustomTextareaComponent } from './shared-components/custom-textarea/custom-textarea.component';
import { MatInputModule } from '@angular/material/input';
import { ThreadMessageComponent } from './shared-components/thread-message/thread-message.component';
import { ThreadComponent } from './thread/thread.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ChatChannelComponent,
    ChatMessageComponent,
    MainChatComponent,
    ChatDirectMessagesComponent,
    CustomTextareaComponent,
    ThreadMessageComponent,
    ThreadComponent
  ],
  imports: [
    CommonModule, 
    ChatRoutingModule, 
    MatCardModule, 
    MatInputModule,
    PickerComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    MainChatComponent, 
    ThreadMessageComponent, 
    CustomTextareaComponent,
    ThreadComponent
  ],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'de' }
  ],
})
export class ChatModule {}
