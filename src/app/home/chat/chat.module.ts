import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatChannelComponent } from './chat-channel/chat-channel.component';
import { ChannelMessageComponent } from './shared/channel-message/channel-message.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { ChatDirectMessagesComponent } from './chat-direct-messages/chat-direct-messages.component';
import { MatCardModule } from '@angular/material/card';
import { CustomTextareaComponent } from './shared/custom-textarea/custom-textarea.component';
import { MatInputModule } from '@angular/material/input';
import { ThreadMessageComponent } from './shared/thread-message/thread-message.component';

@NgModule({
  declarations: [
    ChatChannelComponent,
    ChannelMessageComponent,
    MainChatComponent,
    ChatDirectMessagesComponent,
    CustomTextareaComponent,
    ThreadMessageComponent,
  ],
  imports: [CommonModule, ChatRoutingModule, MatCardModule, MatInputModule],
  exports: [MainChatComponent, ThreadMessageComponent, CustomTextareaComponent],
})
export class ChatModule {}
