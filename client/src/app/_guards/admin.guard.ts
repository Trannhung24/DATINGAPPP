import { Injectable } from "@angular/core";
import { AccountService } from "../_services/account.service";
import { ToastrService } from "ngx-toastr";
import { Observable, map } from "rxjs";
import { CanActivate } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(user => {
        if (user && (user.roles.includes("Admin") || user.roles.includes("Moderator"))) {
          return true;
        } else {
          this.toastr.error("You cannot enter this area");
          return false;
        }
      })
    );
  }
}