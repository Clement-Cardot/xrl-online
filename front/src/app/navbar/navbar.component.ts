import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { CurrentUserService } from '../core/services/current-user.service';
import { UserModel } from '../core/data/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentUser: UserModel | undefined = undefined;

  constructor(
    private router: Router,
    private currentUserService: CurrentUserService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private translate: TranslateService
    ) { }

  /**
   * Initializes the component and subscribes to the current user service to get the current user.
   * @returns void
   */
  ngOnInit(): void {
    this.currentUserService.getCurrentUser().subscribe((user: UserModel | undefined) => {
      this.currentUser = user;
    });
  }

  /**
   * Opens the login dialog with the specified animation durations and disables closing the dialog by clicking outside of it.
   * @param enterAnimationDuration The duration of the enter animation in milliseconds.
   * @param exitAnimationDuration The duration of the exit animation in milliseconds.
   * @returns void
   */
  openLoginDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(LoginComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      autoFocus: false
    });
  }

  /**
   * Clears the current user and navigates to the home page.
   * @returns void
   */
  logout(): void {
    this.openSnackBar();
    this.currentUserService.clearCurrentUser();
    this.router.navigateByUrl('/');
  }

  /**
   * Opens a snackbar with a success message for logout.
   * The message includes the username of the current user.
   * @returns void
   */
  openSnackBar(): void {
    this._snackBar.open(
      this.translate.instant("LOGIN.LOGOUT_SUCCESS", { username: this.currentUser?.login }),
      this.translate.instant("LOGIN.SUCCESS_CLOSE"),
      { duration: 5000 }
    );
  }

  /**
   * Navigates to the specified URL using the Angular router.
   * @param url - The URL to navigate to.
   * @returns void
   */
  switchPage(url: string): void {
    this.router.navigateByUrl(url);
  }
}
