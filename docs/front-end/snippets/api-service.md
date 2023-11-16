# API Service

Api services are front-end interface that allow us to simplify communication between front and back.<br>
These services are interfaces that group together the functions found in each back-end controller.<br>
For each back-end controller, we will have a front-end api service.

The methods defined in a api service can then be called in any component.

Here is an example with the ApiUserService :

```typescript
@Injectable({
  providedIn: 'root'
})
export class ApiUserService {
  private baseUrl =  environment.apiURL;

  constructor(
    private http: HttpClient,
    private userAdapter: UserAdapter
    ) { }

  /**
   * Logs in a user with the given login to the API
   * @param login The user's login.
   * @returns An Observable of the UserModel received from the API.
   * @throws An error if the API returns an error.
   */
  login(login: string): Observable<UserModel> {
    const url = `${this.baseUrl}/login?login=${login}`;
    return this.http.get(url)
    .pipe(
      map((response: any) => this.userAdapter.adapt(response))
    )
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handles HTTP errors and returns an observable with a user-facing error message.
   * @param error - The HttpErrorResponse object to handle.
   * @returns An observable with a user-facing error message.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, body was: `, error.error);
      }
      // Return an observable with a user-facing error message.
      return throwError(() => error);
    }
}
```