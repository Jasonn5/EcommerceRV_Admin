import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubCategoryEditorComponent } from './components/sub-category-editor/sub-category-editor.component';
import { ViewSubCategoriesComponent } from './components/view-sub-categories/view-sub-categories.component';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SubCategoryDatastoreService } from './services/sub-category-datastore.service';
import { SubCategoryService } from './services/sub-category.service';
import { IconRendererComponent } from '../../components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [SubCategoryEditorComponent, ViewSubCategoriesComponent],
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
    SubCategoryDatastoreService,
    SubCategoryService
  ],
  entryComponents: [
    IconRendererComponent,
    ConfirmationModalComponent
  ]
})
export class SubCategoriesModule { }
