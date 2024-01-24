# Navigation

The NavBar element is composed of two part:

- On the left, the navigation menu with the differents pages
- On the right, the language & login/logout system

![Main page](../assets/screenshots/navigation/header-1.png)

#### Navigation Menu

The navigation menu show to the user the differents pages that he has access to :

- [Home]()
- [Projects]()
- [Readiness Levels]()

# Language & Login/Logout

Both the language and the login/logout systems are very simple:

#### Language

By clicking on the "language button" a small dialog will appear.

![Language button](../assets/screenshots/navigation/language-1.png) 

It allows you to change the language of the web application (except what Users have stored in database, for example: a [Project]() description).

![Language dialog](../assets/screenshots/navigation/language-2.png)

![French navbar](../assets/screenshots/navigation/language-3.png)

#### Login

If you are not logged in, the login button will appear on the right of the navbar.

![Login button](../assets/screenshots/navigation/login.png)

When a [User]() click on the login button, a dialog open and ask for a username.

![Login dialog](../assets/screenshots/navigation/login-dialog-1.png)

- If the username field remains empty, an error appears
- If the username does not correspond to a user stored in the database, an error appears

![Login dialog error](../assets/screenshots/navigation/login-dialog-2.png)

#### Logout

- If you are logged in, the login button will disappear and the logout button will replace it

![Logout button](../assets/screenshots/navigation/logout-2.png)

When a [User]() click on the logout button :

- He'll get disconnected