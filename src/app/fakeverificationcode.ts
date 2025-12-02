// fakeverificationcode.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FakeCode {
  // Store box configuration AND expected code
  private boxConfig: number[] = [1, 1, 1, 1]; // Default: 4 boxes with 1 char each
  private expectedCode: string = '1256'; // Default code

  constructor() {
    console.log('Expected Code:', this.expectedCode);
    console.log('Box Config:', this.boxConfig);
  }

  getOtp(): Observable<string> {
    return of(this.expectedCode).pipe(delay(1000));
  }

  // Get expected code chunks for each box
  getExpectedChunks(): string[] {
    const chunks: string[] = [];
    let index = 0;

    for (const chunkSize of this.boxConfig) {
      chunks.push(this.expectedCode.substr(index, chunkSize));
      index += chunkSize;
    }

    return chunks;
  }

  // Get full expected code
  getFullExpectedCode(): string {
    return this.expectedCode;
  }

  // For testing: set custom configuration
  setTestConfig(boxConfig: number[], expectedCode: string): void {
    this.boxConfig = boxConfig;
    this.expectedCode = expectedCode;
    console.log('Updated config:', boxConfig, 'Code:', expectedCode);
  }

  // Generate random configuration for testing
  generateRandomConfig(numBoxes: number = 6): void {
    // Generate random box sizes (1-3 chars per box)
    this.boxConfig = Array.from({ length: numBoxes }, () => 1 + Math.floor(Math.random() * 3));

    // Generate random code matching total length
    const totalLength = this.boxConfig.reduce((sum, size) => sum + size, 0);
    this.expectedCode = Array.from({ length: totalLength }, () =>
      Math.floor(Math.random() * 10).toString()
    ).join('');

    console.log('Random config:', this.boxConfig, 'Code:', this.expectedCode);
  }
}
