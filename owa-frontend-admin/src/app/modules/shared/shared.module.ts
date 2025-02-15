import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { CommonDataTableComponent } from '../common-data-table/common-data-table.component';
import { TableModule } from 'primeng/table';
import { ImageCropperModule } from 'ngx-image-cropper';

/*------------------- MATERIAL COMPONENTS ------------------------*/
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
/*------------------- MATERIAL COMPONENTS ------------------------*/

/*------------------- DIRECTIVES ------------------------*/
import { RangeDirective } from './directives/range.directive';
import { RangeLengthDirective } from './directives/range-length.directive';
import { MaxDirective } from './directives/max.directive';
import { MinDirective } from './directives/min.directive';
import {
  InpuTrimValidator,
  InputTrimDirective,
} from './directives/input-trim.directive';
import { InputCharDirective } from './directives/input-char.directive';
import { MobileNumberDirective } from './directives/mobile-number.directive';
import { DndDirective } from './directives/dnd.directive';
import { OtpNumberDirective } from './directives/otp-number.directive';
import { IntegerInputDirective } from './directives/input-integer.directive';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { MatStepperModule } from '@angular/material/stepper';
import { PropertiesModalComponent } from './components/properties-modal/properties-modal.component';
import { TitleComponent } from './components/title/title.component';
import { CommonDataViewComponent } from '../common-data-view/common-data-view.component';
import { DataViewModule } from 'primeng/dataview';
import { CardComponent } from './components/card/card.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ContextMenuModule } from 'primeng/contextmenu';

/*------------------- DIRECTIVES ------------------------*/

const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const common_components = [CommonDataTableComponent, CommonDataViewComponent];

const export_components = [
  LoaderComponent,
  HeaderComponent,
  TitleComponent,
  CardComponent,
  SidebarMenuComponent,
];
const export_directives = [
  RangeDirective,
  RangeLengthDirective,
  MaxDirective,
  MinDirective,
  InputTrimDirective,
  InputCharDirective,
  MobileNumberDirective,
  DndDirective,
  OtpNumberDirective,
  IntegerInputDirective,
];
const export_material_modules = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
  NgxSpinnerModule,
  MatExpansionModule,
  MatTabsModule,
  DragDropModule,
  TableModule,
  DataViewModule,
  MatRadioModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatButtonToggleModule,
  ImageCropperModule,
  ContextMenuModule,
];

@NgModule({
  declarations: [
    ...export_components,
    ...export_directives,
    ...common_components,
    PropertiesModalComponent,
    SidebarMenuComponent,
  ],
  imports: [...export_material_modules, ToastrModule.forRoot()],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ...export_components,
    ...export_material_modules,
    ...common_components,
    ...export_directives,
    ToastrModule,
  ],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class SharedModule {}
