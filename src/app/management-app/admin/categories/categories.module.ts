import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryEditorComponent } from './components/category-editor/category-editor.component';
import { ViewCategoriesComponent } from './components/view-categories/view-categories.component';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CategoryDatastoreService } from './services/category-datastore.service';
import { CategoryService } from './services/category.service';
import { IconRendererComponent } from '../../components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [CategoryEditorComponent, ViewCategoriesComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NbIconModule,
    NbEvaIconsModule,
    AgGridModule.withComponents([]),
    AppRoutingModule
  ],
  providers: [
    CategoryDatastoreService,
    CategoryService
  ],
  entryComponents: [
    IconRendererComponent,
    ConfirmationModalComponent
  ]
})
export class CategoriesModule { }
