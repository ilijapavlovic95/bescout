import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './../../services/auth';
import { ReportsService } from './../../services/reports';
import { Report } from './../../models/report';
import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

/**
 * Generated class for the CommunityReportComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'community-report',
  templateUrl: 'community-report.html'
})
export class CommunityReportComponent implements OnDestroy {

  subscriptionLike: Subscription;
  subscriptionDislike: Subscription;

  @Input('report') report: Report;
  @Output() editClicked = new EventEmitter();
  @Output() viewClicked = new EventEmitter();

  constructor(private reportsService: ReportsService, private auth: AuthService) {
    console.log('Hello CommunityReportComponent Component');
  }

  getReportStatus() {
    if (this.report && this.report.endDate)
      return 'FINISHED';
    return 'IN PROGRESS';
  }

  alreadyLiked() {
    for (const userId of this.report.likes) {
      if (userId === this.auth.getCurrentUser()._id) {
        return true;
      }
    }
    return false;
  }

  alreadyDisliked() {
    for (const userId of this.report.dislikes) {
      if (userId === this.auth.getCurrentUser()._id) {
        return true;
      }
    }
    return false;
  }

  likeReport(mode: string) {
    this.subscriptionLike = this.reportsService.rateReport('like', mode, this.report).subscribe(
        (data: any) => {
          this.report.likes = data.report.likes;
          this.report.dislikes = data.report.dislikes;
        },
        (err) => console.log(err)
      );
  }

  dislikeReport(mode: string) {
    this.subscriptionLike = this.reportsService.rateReport('dislike', mode, this.report).subscribe(
        (data: any) => {
          this.report.dislikes = data.report.dislikes;
          this.report.likes = data.report.likes;
        },
        (err) => console.log(err)
      );
  }

  ngOnDestroy() {
    if (this.subscriptionDislike) {
      this.subscriptionDislike.unsubscribe();
    }
    if (this.subscriptionLike) {
      this.subscriptionLike.unsubscribe();
    }
  }

}
