# Services

Services are classes that each components can use to call methods or share data with the rest of the application.

Most of the services are API services, which are used to call the API. But one service is a bit different: the `CurrentUserService`.

## CurrentUserService

The `CurrentUserService` is a service that is used to share the current user data with the rest of the application.
This class also use the localStorage of the browser so that the user data is kept even if the user refreshes the page or restart his computer.

## API services

Each API service corresponds to a Backend Controller. For example, the `APIUserService` corresponds to the `UserController` in the backend.

Here is an example with the `APIUserService`:

```typescript title="/front/src/app/services/api-user.service.ts"
export class ApiUserService extends BaseService{
  private baseUrl = '/api/users';

  constructor(
    private http: HttpClient,
    private userAdapter: UserAdapter,
    router: Router
    ) {
      super(router);
     }

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
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Checks the connection status.
   * @returns An Observable that emits a boolean indicating the connection status.
   */
  checkConnexion(): Observable<boolean> {
    const url = `${this.baseUrl}/check-connexion`;
    return this.http.get(url)
    .pipe(
      map((response: any) => response)
    )
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  ...
}
```