import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { initialState } from 'ngx-bootstrap/timepicker/reducer/timepicker.reducer';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModelRef!: BsModalRef;
  constructor(private modalService: BsModalService) { }

  confirm(title = 'Confirmation', 
      message = 'Are you sure you want to do this', 
      btnOkText = 'Ok', 
      btnCancelText = 'Cancel') : Observable<boolean>{
    const config = {
      initialState: {
        title,
        message,
        btnOkText,
        btnCancelText
      }
    }
    this.bsModelRef = this.modalService.show(ConfirmDialogComponent, config);
    return new Observable<boolean>(this.getResult());
  }

  private getResult(){
    return (observer: { next: (arg0: any) => void; complete: () => void; }) => {
      const subscription = this.bsModelRef.onHidden?.subscribe(() => {
        observer.next(this.bsModelRef.content.result);
        observer.complete();
      })
      return {
        unsubscribe() {
          subscription?.unsubscribe();
        }
      }
    }
  }
}