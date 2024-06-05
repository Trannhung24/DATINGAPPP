import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from "@angular/router";
import { Member } from "../_models/member";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { MembersService } from "../_services/members.service";

@Injectable({
    providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member> {
    constructor(private memberService: MembersService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Member> {
        const username = route.paramMap.get('username');

        if (username === null) {
            this.router.navigate(['/not-found']);
            return of();
        }

        return this.memberService.getMember(username).pipe(
            catchError(error => {
                this.router.navigate(['/not-found']);
                return of();
            })
        );
    }
}