import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../_models/member';
import { environment } from '../environments/environment';
import { map, of, Observable, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map<string, PaginatedResult<Member[]>>();
  user!: User;
  userParams!: UserParams;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.user = user;
        this.userParams = new UserParams(user);
      }
    });
  }
  getUserParams() {
    return this.userParams;
  }
  setUserParams(params: UserParams) {
    this.userParams = params;
  }
  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }
  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize)
    params = params.append('minAge', userParams.minAge.toString())
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http).pipe(map(response => {
      this.memberCache.set(Object.values(userParams).join('-'), response);
      return response;
    }));
  }

  getMember(username: string): Observable<Member> {
    const member = [...this.memberCache.values()]
      .reduce((array, element) => {
        if (element.result) {
          return array.concat(element.result);
        }
        return array;
      }, [] as Member[])
      .find((member: Member) => member.username === username);

    if (member) {
      return of(member);
    }

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member): Observable<void> {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        if (index !== -1) {
          this.members[index] = member;
        }
      })
    );
  }

  setMainPhoto(photoId: number): Observable<void> {
    return this.http.put<void>(
      this.baseUrl + 'users/set-main-photo/' + photoId,
      {}
    );
  }

  deletePhoto(photoId: number): Observable<void> {
    return this.http.delete<void>(
      this.baseUrl + 'users/delete-photo/' + photoId
    );
  }
  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }
  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<Member[]>>(
      this.baseUrl + 'likes',
      params,
      this.http
    );
  }
}
