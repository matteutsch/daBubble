/* The userData class represents user data with properties for name, email, uid, photoURL, and chat. */
export class userData {
  public name: string = '';
  public email: string = '';
  public uid: string = '';
  public photoURL: string = '';
  public chat: string[] = [];

  /* The `toJson()` method is a function defined within the `userData` class. It returns an object that
represents the current state of the `userData` instance. The object contains properties such as
`name`, `email`, `uid`, `photoURL`, and `chat`, which are assigned the corresponding values from the
instance's properties. */
  public toJson() {
    return {
      name: this.name,
      email: this.email,
      uid: this.uid,
      photoURL: this.photoURL,
      chat: this.chat,
    };
  }
}
