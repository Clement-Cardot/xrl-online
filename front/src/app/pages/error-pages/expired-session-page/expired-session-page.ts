import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CurrentUserService } from "src/app/core/services/current-user.service";

@Component({
  selector: 'expired-session-page',
  templateUrl: 'expired-session-page.html'
})
export class ExpiredSessionPage {
  constructor(
    private currentUserService: CurrentUserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUserService.clearCurrentUser();
    this.router.navigateByUrl('/#session-expired');
  }
}