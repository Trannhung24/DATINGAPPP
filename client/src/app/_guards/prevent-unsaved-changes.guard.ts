import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { Injectable } from '@angular/core';
import { ConfirmService } from '../_services/confirm.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class preventUnsavedChangesGuard implements CanDeactivate<unknown> {
  constructor(private confirmService: ConfirmService){}
  canDeactivate(component: MemberEditComponent): Observable<boolean> | boolean{
    if(component.editForm && component.editForm.dirty){
      return this.confirmService.confirm();
    }
    return true;
  }

};