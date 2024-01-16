import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatMessageComponent } from './shared-components/chat-message/chat-message.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { MatCardModule } from '@angular/material/card';
import { CustomTextareaComponent } from './shared-components/custom-textarea/custom-textarea.component';
import { MatInputModule } from '@angular/material/input';
import { ThreadComponent } from './thread/thread.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { EditMessageFormComponent } from './shared-components/edit-message-form/edit-message-form.component';
import { HeaderNewMessageComponent } from './header-new-message/header-new-message.component';
import { HeaderPrivateChatComponent } from './header-private-chat/header-private-chat.component';
import { HeaderChannelChatComponent } from './header-channel-chat/header-channel-chat.component';
import { EmojiPickerComponent } from './shared-components/emoji-picker/emoji-picker.component';
import { ThreadAnswerComponent } from './shared-components/thread-answer/thread-answer.component';
@NgModule({
  declarations: [
    ChatMessageComponent,
    MainChatComponent,
    CustomTextareaComponent,
    ThreadComponent,
    ThreadAnswerComponent,
    EditMessageFormComponent,
    HeaderNewMessageComponent,
    HeaderPrivateChatComponent,
    HeaderChannelChatComponent,
    EmojiPickerComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MatCardModule,
    MatInputModule,
    PickerComponent,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    PickerComponent
  ],
  exports: [
    MainChatComponent,
    CustomTextareaComponent,
    ThreadComponent,
  ],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'de' }],
})
export class ChatModule {}
