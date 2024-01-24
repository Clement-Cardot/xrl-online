import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { throwError } from "rxjs";

export abstract class BaseService {

    constructor(
        private router: Router
        ) {
        }

    /**
    * Handles HTTP errors and returns an observable with a user-facing error message.
    * @param error - The HttpErrorResponse object to handle.
    * @returns An observable with a user-facing error message.
    */
    protected handleError(error: HttpErrorResponse) {
        // If client get 403 error, it means that the token is expired
        if (error.status == 403) {
            // If client get 403 error, it means that the token is expired
            this.router.navigateByUrl('/session-expired');
        }

        // Return an observable with a user-facing error message.
        return throwError(() => error);
    }
}