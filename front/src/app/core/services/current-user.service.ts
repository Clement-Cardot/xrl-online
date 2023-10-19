import { Injectable } from "@angular/core";
import { UserModel, UserAdapter } from "../data/models/user.model";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class CurrentUserService {
    currentUser: BehaviorSubject<UserModel | undefined> = new BehaviorSubject<UserModel | undefined>(undefined);

    constructor(
        private userAdapter: UserAdapter
    ) {}

    /**
     * Returns a BehaviorSubject that emits the current user or undefined if not available.
     * If the current user is not available in localStorage, the BehaviorSubject will emit the current value.
     * @returns {BehaviorSubject<UserModel | undefined>} The BehaviorSubject that emits the current user or undefined.
     */
    public getCurrentUser(): BehaviorSubject<UserModel | undefined> {
        let data = localStorage.getItem("currentUser");
        if (data == null) {
            return this.currentUser;
        }
        this.setCurrentUser(this.userAdapter.adapt(JSON.parse(data)));            
        return this.currentUser;
    }

    /**
     * Sets the current user and saves it to local storage.
     * @param user The user to set as the current user.
     * @returns void
     */
    public setCurrentUser(user: UserModel): void {
        this.currentUser.next(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
    }

    /**
     * Checks if the current user is logged in.
     * @returns {boolean} True if the current user is logged in, false otherwise.
     */
    public isLoggedIn(): boolean {
        return this.currentUser.value != null;
    }

    /**
     * Clears the current user by setting the currentUser BehaviorSubject to undefined and removing it from localStorage.
     * @returns void
     */
    public clearCurrentUser(): void {
        this.currentUser.next(undefined);
        localStorage.removeItem("currentUser");
    }

    /**
     * Clears all data stored in the local storage.
     * @returns void
     */
    public cleanAllData(): void {
        localStorage.clear();
    }
}