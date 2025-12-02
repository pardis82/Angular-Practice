import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FakeCode {
  getOtp(): Observable<string> {
    return of('123456789101112').pipe(delay(10000));
  }
}
