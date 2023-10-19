# NavBar

The NavBar element is composed of two part :

- On the left, the navigation menu with the differents pages

[INSERT SCREENSHOT]

- On the right, the language & login/logout system

[INSERT SCREENSHOT]

### Navigation Menu

The navigation menu show to the user the differents pages that he has access to :

- [Home]()
- [Projects]()
- [Readiness Levels]()

When logged as an admin, a management button is added to the menu.<br>
This button open an other menu with :

- [Readiness Levels]()
- [Teams]()
- [Business Lines]()

### Language Button

The language button is represented by a round flag, by clicking on it, it show to the user the availables languages. 
The user has just to select the desired language and the app will automatically change language.

[INSERT SCREENSHOT]

When starting the application, the default language will always be French (for now).<br>
In the future, we may add a cookie to store this preference for each user.

### Login/Logout

The login/logout system is very simple :

##### Login

If you are not logged in, the login button will appear on the right of the navbar. <br>
When a user click on the login button, a dialog open and ask for a username.

- If the username field is empty, an error appears
- If the username does not correspond to a user stored in the database, an error appears

If the login request succeed :

1. the dialog will disappear
2. the user data will be store locally
3. a snack bar will appear saying login succeed

##### Logout

- If you are logged in, the login button will disappear and the logout button will replace it

When a user click on the logout button :

1. the local storage storing his user data will be flush 
2. he will be redirected to the home page
3. a snack bar will appear saying logout succeed