import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditorComponent } from './components/user-editor/user-editor.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { IconRendererComponent } from '../components/icon-renderer/icon-renderer.component';

@NgModule({
  declarations: [UserEditorComponent, ViewUsersComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    FormsModule,
    NbCardModule,
    NbIconModule,
    NbEvaIconsModule,
    NbSpinnerModule,
    NgbModule,
    AppRoutingModule
  ],
  entryComponents: [
    IconRendererComponent
  ]
})
export class UsersModule { }
