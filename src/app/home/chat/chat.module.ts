import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatChannelComponent } from './chat-channel/chat-channel.component';
import { ChannelMessageComponent } from './shared-components/channel-message/channel-message.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { ChatDirectMessagesComponent } from './chat-direct-messages/chat-direct-messages.component';
import { MatCardModule } from '@angular/material/card';
import { CustomTextareaComponent } from './shared-components/custom-textarea/custom-textarea.component';
import { MatInputModule } from '@angular/material/input';
import { ThreadMessageComponent } from './shared-components/thread-message/thread-message.component';
import { ThreadComponent } from './thread/thread.component';

@NgModule({
  declarations: [
    ChatChannelComponent,
    ChannelMessageComponent,
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
    MatInputModule
  ],
  exports: [
    MainChatComponent, 
    ThreadMessageComponent, 
    CustomTextareaComponent,
    ThreadComponent
  ],
})
export class ChatModule {}
