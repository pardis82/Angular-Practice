import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class Modal {
  private modalState = new BehaviorSubject<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    icon: '',
  });
  public state: Observable<ModalState> = this.modalState.asObservable()
}
