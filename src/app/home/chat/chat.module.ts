import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatChannelComponent } from './chat-channel/chat-channel.component';
import { ChannelMessageComponent } from './shared/channel-message/channel-message.component';

@NgModule({
  declarations: [ChatChannelComponent, ChannelMessageComponent],
  imports: [CommonModule, ChatRoutingModule],
})
export class ChatModule {}
