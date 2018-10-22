import {
    Component, OnInit,
    Input, ViewChild,
    Output, EventEmitter, HostListener, ElementRef, Optional, Inject
} from '@angular/core';
import { isArray, isObject } from 'util';

import {
    NgModel,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
    NG_ASYNC_VALIDATORS,
    FormGroup,
} from '@angular/forms';
import { ValueAccessorBase } from './value-accessor';

import { ElementBase } from './element-base';

@Component({
    selector: 'app-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: AutocompleteComponent, multi: true }
    ],
})
export class AutocompleteComponent extends ElementBase<string> {
    @Input() items: Array<any> = [];
    @Input() searchCharLimit = 2;
    @Input() modelProperty = '';
    @Input() viewProperty = '';
    @Input() isRequired = false;
    @Input() errorMessage = '';
    @Input() showLoading = false;
    @Input() isDisabled = false;
    @Input() autoForm: FormGroup;
    @Input() formType = 'template';
    @Input() formCtrlName = '';

    @Output() onChange = new EventEmitter<any>();
    @Output() onSelect = new EventEmitter<any>();

    @ViewChild(NgModel) model: NgModel;

    public identifier = `form-text-${identifier++}`;

    private selectedItemObj: any;

    @Input() selectedItem = '';
    @Input() showDropdown = false;

    constructor(@Optional() @Inject(NG_VALIDATORS) private avalidators: Array<any>,
        @Optional() @Inject(NG_ASYNC_VALIDATORS) private aasyncValidators: Array<any>, private eRef: ElementRef) {
        super(avalidators, aasyncValidators);
    }

    ngOnInit() {
    }

    ngOnChanges() {

        if (isArray(this.items)) {
            if (this.items.length > 0) {

            }
        } else {
            this.items = [];
        }

        if (this.isDisabled) {
          this.value = '';
        }
    }

    search() {
        if (this.value.length >= this.searchCharLimit) {
            this.onChange.emit(this.value);
        }
    }

    setSelectedItem(item) {

        this.selectedItem = item[this.modelProperty];
        this.showDropdown = false;
        const data = {
            item: item,
            value: this.selectedItem
        };
        if (this.formType === 'template') {
            this.value = this.selectedItem;
        } else if (this.formType === 'reactive') {
           this.autoForm.controls[this.formCtrlName].setValue(this.selectedItem);
        }

      //  this.onSelect.emit(data);


    }

    @HostListener('document:click', ['$event'])
    clickOut(e) {
        if (this.eRef.nativeElement.contains(event.target)) {

        } else {
            this.showDropdown = false;
        }
    }

    triggerDropdown() {
        if (this.items.length > 0) {
            this.showDropdown = true;
        }
    }

    onBlur() {
        if (!this.showDropdown) {
            if (isObject(this.selectedItemObj)) {
                if (this.selectedItemObj[this.modelProperty] !== this.value) {
                    this.value = '';
                }
            } else {
                this.value = '';
            }
        } else {
          this.value = '';
        }
    }

    get autoFormControls() {
      return this.autoForm.controls;
    }

}

let identifier = 0;
