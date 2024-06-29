import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilderService } from './services/form-builder.service';
import { CommonDataViewComponent } from 'src/app/modules/common-data-view/common-data-view.component';

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
  rowsPerPage = 5;
  rows = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];
  currentPage = 0;

  constructor(private formBuilderService: FormBuilderService) {}

  ngOnInit(): void {
    this.getGirdData();
  }

  getGirdData(searchedValue?) {
    try {
      const payload: any = {
        page_size:
          this.dataView && this.dataView.rows ? this.dataView.rows : 50,
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

  onPageChangeEvent(event) {
    console.log(event);
    this.currentPage = event.first == 0 ? 1 : event.first / event.rows + 1;
    this.gridData.rows = event.rows;
    this.getGirdData();
  }
}
