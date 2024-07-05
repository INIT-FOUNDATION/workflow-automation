import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilderService } from './services/form-builder.service';
import { CommonDataViewComponent } from 'src/app/modules/common-data-view/common-data-view.component';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
})
export class FormBuilderComponent implements OnInit {
  @ViewChild('dataView')
  dataView: CommonDataViewComponent;
  gridData: any = [];
  delayedTime: any;
  @ViewChild('gridViewItem') gridViewItem: TemplateRef<any>;
  rowsPerPage = 6;
  rows = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];
  currentPage = 1;

  constructor(
    private formBuilderService: FormBuilderService,
    private router: Router,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.getGirdData();
    localStorage.removeItem('formDetails');
  }

  getGirdData(searchedValue?) {
    try {
      const payload: any = {
        page_size: this.dataView && this.dataView.rows ? this.dataView.rows : 6,
        current_page: this.currentPage,
      };
      if (searchedValue) {
        payload.search_query = searchedValue;
      }
      this.formBuilderService.getFormGridData(payload).subscribe((res: any) => {
        this.gridData = res.data.formsList;
        this.dataView.data = res.data.formsList;
        this.dataView.totalRecords = res.data.total_count;
      });
    } catch (error) {
      console.log(error);
    }
  }

  getSearchedValue(value) {
    clearTimeout(this.delayedTime);

    this.delayedTime = setTimeout(() => {
      this.getGirdData(value);
    }, 1000);
  }

  onCustomPageChangeEvent(event) {
    this.currentPage = event.currentPage;
    // this.dataView.rows = event.rows;
    this.getGirdData();
  }

  updateCard(id: number) {
    this.router.navigate([`/form-builder/update-form-name/:${id}`]);
  }

  openSwalModal(id: number, status: number) {
    Swal.fire({
      title: `Are you sure?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateCardStatus(id, status);
      }
    });
  }

  updateCardStatus(id: number, status: number) {
    const payload: any = {
      form_id: id,
      status: status,
    };
    this.formBuilderService.updateStatus(payload).subscribe((res: any) => {
      if (res) {
        this.utilityService.showSuccessMessage(res?.message);
        this.getGirdData();
      }
    });
  }

  redirectToForm() {
    this.router.navigate(['form-builder/form-name']);
  }
}
