import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEntry } from './code-entry';

describe('CodeEntry', () => {
  let component: CodeEntry;
  let fixture: ComponentFixture<CodeEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
