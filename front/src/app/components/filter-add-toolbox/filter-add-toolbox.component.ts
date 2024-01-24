import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CurrentUserService } from 'src/app/core/services/current-user.service';

@Component({
  selector: 'app-filter-add-toolbox',
  templateUrl: './filter-add-toolbox.component.html',
  styleUrls: ['./filter-add-toolbox.component.scss'],
})
export class FilterAddToolboxComponent {
  @Input({ required: true }) searchTypes: {
    typeValue: string;
    typeTranslation: string;
  }[] = [];
  @Input({ required: false }) projectAdd?: boolean;
  @Output() updateDisplayEvent: EventEmitter<{
    searchType: string;
    filterValue: string | null;
  }> = new EventEmitter<{ searchType: string; filterValue: string | null }>();
  @Output() openAddDialogEvent: EventEmitter<null> = new EventEmitter<null>();

  searchType: string = '';
  filterFormControl = new FormControl('');
  checkboxDisplay = false;
  disabledAddButton = true;
  checkboxState: boolean = false;

  constructor(private currentUserService: CurrentUserService) {}

  ngOnInit(): void {
    this.searchType = this.searchTypes[0].typeValue;
    if ( this.currentUserService.isLoggedIn() ) {
      
      if (this.currentUserService.getCurrentUser().value !== null) {
        this.disabledAddButton = false;
      }

      if (this.projectAdd !== null && this.projectAdd)
      this.checkboxDisplay = true;
    }
  }

  updateFilter() {
    let options: {
      searchType: string;
      filterValue: string | null;
      checkbox: boolean;
    };

    if (
      this.filterFormControl.value == null ||
      this.filterFormControl.value == ''
    ) {
      options = {
        searchType: this.searchType,
        filterValue: null,
        checkbox: this.checkboxState,
      };
      this.updateDisplayEvent.emit(options);
    } else {
      options = {
        searchType: this.searchType,
        filterValue: this.filterFormControl.value,
        checkbox: this.checkboxState,
      };
      this.updateDisplayEvent.emit(options);
    }
  }

  clearSearchInput() {
    // Reset form
    this.filterFormControl.setValue('');
    this.searchType = this.searchTypes[0].typeValue;

    // Emit event
    let options: { searchType: string; filterValue: string | null };
    options = { searchType: this.searchType, filterValue: null };
    this.updateDisplayEvent.emit(options);
  }

  changeCheckboxState() {
    if (this.checkboxState) {
      this.checkboxState = false;
    } else {
      this.checkboxState = true;
    }
    this.updateFilter();
  }
}
