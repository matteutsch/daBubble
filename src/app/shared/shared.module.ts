import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingDialogComponent } from './loading/loading-dialog/loading-dialog.component';
import { ErrorDialogComponent } from './errors/error-dialog/error-dialog.component';
import { RouterModule } from '@angular/router';
import { ErrorDialogService } from './errors/error-dialog.service';
import { LoadingDialogService } from './loading/loading-dialog.service';
import { MaterialModule } from '../material/material.module';

const sharedComponents = [LoadingDialogComponent, ErrorDialogComponent];

@NgModule({
  declarations: [...sharedComponents],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [...sharedComponents],
  providers: [ErrorDialogService, LoadingDialogService],
})
export class SharedModule {}
