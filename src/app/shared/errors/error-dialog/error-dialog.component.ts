import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss'],
})
export class ErrorDialogComponent {
  public errorMessage: string = this.data.message;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; status?: number }
  ) {
    this.setErrorMessage();
  }

  setErrorMessage() {
    if (
      this.data.message === 'Firebase: Error (auth/invalid-login-credentials).'
    ) {
      this.errorMessage =
        'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre E-Mail-Adresse und Ihr Passwort und versuchen Sie es erneut.';
    }
  }
}
