import { Component, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';

/**
 * Generated class for the ReportDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'report-details',
  templateUrl: 'report-details.html'
})
export class ReportDetailsComponent{

  @Input('report') report;
  @Output() editClicked = new EventEmitter();
  @Output() viewClicked = new EventEmitter();

  constructor() {
    console.log('Hello ReportDetailsComponent Component');
  }

  getReportStatus() {
    if (this.report && this.report.endDate)
      return 'FINISHED';
    return 'IN PROGRESS';
  }

}
