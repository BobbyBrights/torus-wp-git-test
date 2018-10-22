import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TimerComponent } from './timer/timer.component';
import { DialogComponent } from './dialog/dialog.component';
import { HeaderComponent } from './header/header.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { LoaderComponent } from './loader/loader.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FooterComponent } from './footer/footer.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { InputLoaderComponent } from './input-loader/input-loader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    TimerComponent,
    DialogComponent,
    HeaderComponent,
    AutocompleteComponent,
    LoaderComponent,
    FooterComponent,
    ProgressBarComponent,
    InputLoaderComponent
  ],
  exports: [TimerComponent, DialogComponent, AutocompleteComponent,
    LoaderComponent, HeaderComponent, BsDatepickerModule, FooterComponent, InputLoaderComponent]
})
export class SharedModule { }
