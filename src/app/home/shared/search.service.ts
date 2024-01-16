import { Injectable, OnDestroy } from '@angular/core';
import {
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
} from 'rxjs';
import { Chat, ChatMember, Message, User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ChannelChatService } from './channel-chat.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class SearchService implements OnDestroy {
  private subscription!: Subscription;
  public searchTerm: string = '';

  constructor(
    private userService: UserService,
    private firestoreService: FirestoreService,
    private channelChatService: ChannelChatService,
    private afs: AngularFirestore
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Filters users based on a search term within the username.
   * @param {string} term - The search term to filter users by.
   * @returns {User[]} - An array of user objects containing the search term.
   */
  getUsersByTerm(term: string): User[] {
    const allUsers: User[] = this.userService.users;
    term = term.toLowerCase();
    return allUsers.filter((user: User) => {
      const userNameLower = user.name.toLowerCase();
      return userNameLower.includes(term);
    });
  }

  /**
   * Filters channels based on a search term within the channel name.
   *
   * @param {string} term - The search term to filter channels by.
   * @returns {Chat[]} An array of channel objects containing the search term.
   */
  getChannelsByTerm(term: string): Chat[] {
    const allCahnnels: Chat[] = this.channelChatService.channels;
    term = term.toLowerCase();
    return allCahnnels.filter((channel: Chat) => {
      const channelNameLower = channel.name.toLowerCase();
      return channelNameLower.includes(term);
    });
  }

  /**
   * Retrieves search results based on the provided input observable.
   * Filters, debounces, and switches to a new observable based on the search term.
   *
   * @param {Observable<any>} input - The input observable for search terms.
   * @returns {Observable<User[]>} An observable emitting user search results.
   */
  getResults(input: Observable<any>): Observable<User[]> {
    return input.pipe(
      filter((term) => term.length >= 3),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term) => this.searchUsers(term))
    );
  }

  /**
   * Searches for users based on the provided search term.
   * Filters the results based on the search term and excludes the current user.
   *
   * @param {string} searchTerm - The term to search for in user names.
   * @returns {Observable<User[]>} An observable emitting filtered user search results.
   */
  searchUsers(searchTerm: string): Observable<User[]> {
    return this.userService.usersSubject.pipe(
      map((users) =>
        users
          .filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .filter((user) => user.name !== this.userService.user.name)
      )
    );
  }

  /**
   * Searches user chats based on a search term, filters messages, and updates private chat names.
   *
   * @param {Chat[]} uChannelChats - Array of user channel chats.
   * @param {ChatMember[]} privateChatMembers - Array of private chat members.
   * @param {string} term - The search term.
   * @returns {Promise<Chat[]>} - A promise that resolves to an array of user chats.
   */
  async searchUserChatsByTerm(
    uChannelChats: Chat[],
    privateChatMembers: ChatMember[],
    term: string
  ): Promise<Chat[]> {
    const allChats = (await this.getAllUserChats(
      uChannelChats,
      privateChatMembers
    )) as Chat[];
    term = term.toLowerCase();
    const chatsWithTerm: Chat[] = await this.filterChatsByTerm(allChats, term);
    for (const chat of chatsWithTerm) {
      if (chat.type === 'private') {
        await this.updatePrivateChatName(chat);
      }
    }
    return chatsWithTerm;
  }

  /**
   * Filters chats based on the search term in message content.
   *
   * @private
   * @param {Chat[]} allChats - Array of all user chats.
   * @param {string} term - The search term.
   * @returns {Chat[]} - An array of chats that match the search term.
   */
  private async filterChatsByTerm(
    allChats: Chat[],
    term: string
  ): Promise<Chat[]> {
    return allChats
      .filter((chat) =>
        chat.messages?.some((message) =>
          message.content.toLowerCase().includes(term)
        )
      )
      .map((chat) => ({
        ...chat,
        messages: chat.messages?.filter((message) =>
          message.content.toLowerCase().includes(term)
        ),
      }));
  }

  /**
   * Updates private chat names based on other member's names.
   *
   * @private
   * @param {Chat} chat - The private chat to update.
   * @returns {Promise<void>} - A promise indicating the success or failure of the update.
   */
  private async updatePrivateChatName(chat: Chat): Promise<void> {
    const otherMembersIds = chat.members || [];
    const memberId =
      otherMembersIds.length > 1
        ? otherMembersIds.find((id) => id !== this.userService.user.uid)
        : otherMembersIds[0];

    if (memberId) {
      const memberName = await this.firestoreService.getPropertyFromDocument(
        'users',
        memberId,
        'name'
      );
      chat.name = memberName;
    }
  }

  /**
   * Gets all user chats including channel chats and private chats.
   *
   * @param {Chat[]} uChannelChats - Array of user channel chats.
   * @param {ChatMember[]} privateChatMembers - Array of private chat members.
   * @returns {Promise<Chat[]>} - A promise that resolves to an array of all user chats.
   */
  async getAllUserChats(
    uChannelChats: Chat[],
    privateChatMembers: ChatMember[]
  ): Promise<Chat[]> {
    const allChats: Chat[] = [];
    const privateChatPromises = privateChatMembers.map(
      async (member: ChatMember) => {
        const chat: Chat =
          await this.firestoreService.getDocumentFromCollection(
            'privateChats',
            member.chatID
          );
        return chat;
      }
    );
    const privateChats = await Promise.all(privateChatPromises);
    allChats.push(...uChannelChats, ...privateChats);
    await this.setMessagesToSearchedChats(allChats);
    return allChats;
  }

  /**
   * Asynchronously sets messages for each chat in the specified array by fetching them from Firestore.
   *
   * @private
   * @method
   * @param {Chat[]} allChats - The array of chats for which messages will be fetched and set.
   * @returns {Promise<void>} - A promise that resolves when all messages are fetched and set.
   */
  private async setMessagesToSearchedChats(allChats: Chat[]): Promise<void> {
    const fetchMessagesPromises: Promise<void>[] = [];
    allChats.forEach((chat: Chat) => {
      const messagesRef = this.afs
        .collection(`${chat.type}Chats`)
        .doc(chat.chatID)
        .collection('messages');
      const fetchMessagesPromise = messagesRef
        .valueChanges()
        .pipe(take(1))
        .toPromise()
        .then((messages) => {
          chat.messages = messages as Message[];
        });

      fetchMessagesPromises.push(fetchMessagesPromise);
    });
    await Promise.all(fetchMessagesPromises);
  }
}
