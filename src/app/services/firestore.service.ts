import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';
import { Chat, Message } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  /**
   * Asynchronously retrieves a specific property from a document in a Firestore collection.
   *
   * @param {string} collection - The name of the Firestore collection.
   * @param {string} docId - The ID of the document within the collection.
   * @param {string} propertyName - The name of the property to retrieve from the document.
   * @returns {Promise<any | null>} - A Promise that resolves to the value of the specified property, or null if the document is not found.
   */
  async getPropertyFromDocument<T>(
    collection: string,
    docId: string,
    propertyName: string
  ): Promise<any | null> {
    if (docId) {
      try {
        const docRef = this.firestore.collection(collection).doc(docId);
        const docSnapshot = await firstValueFrom(docRef.get());

        if (docSnapshot.exists) {
          const propertyValue = docSnapshot.get(propertyName);
          return propertyValue;
        } else {
          console.error(
            `Document with ID ${docId} in the collection ${collection} not found.`
          );
          return null;
        }
      } catch (error) {
        console.error(
          `Error retrieving the document: ${error}, collection: ${collection}, docId: ${docId}, propertyName: ${propertyName}`
        );
        return null;
      }
    }
  }

  /**
   * Asynchronously retrieves an entire document from a Firestore collection.
   *
   * @param {string} collection - The name of the Firestore collection.
   * @param {string} docId - The ID of the document within the collection.
   * @returns {Promise<any | null>} - A Promise that resolves to the entire document, or null if the document is not found.
   */
  async getDocumentFromCollection<T>(
    collection: string,
    docId: string
  ): Promise<any | null> {
    if (docId) {
      try {
        const docRef = this.firestore.collection(collection).doc(docId);
        const docSnapshot = await firstValueFrom(docRef.get());

        if (docSnapshot.exists) {
          const documentData = docSnapshot.data();
          return documentData;
        } else {
          console.error(
            `Document with ID ${docId} in the collection ${collection} not found.`
          );
          return null;
        }
      } catch (error) {
        console.error(`Error retrieving the document: ${error}`);
        return null;
      }
    }
  }

  /**
   * Retrieves the Firestore document reference for a specific message within a chat.
   *
   * @method
   * @param {Chat} chat - The chat containing the message.
   * @param {Message} msg - The message for which to obtain the document reference.
   * @returns {AngularFirestoreDocument<Message>} - The Firestore document reference for the specified message.
   */
  public getMsgDocRef(chat: Chat, msg: Message): AngularFirestoreDocument<Message> {
    return this.firestore
      .collection(`${chat.type}Chats`)
      .doc(chat.chatID)
      .collection('messages')
      .doc(msg.msgId);
  }
}
