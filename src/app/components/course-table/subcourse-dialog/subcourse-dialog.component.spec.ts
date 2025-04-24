import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcourseDialogComponent } from './subcourse-dialog.component';

describe('SubcourseDialogComponent', () => {
  let component: SubcourseDialogComponent;
  let fixture: ComponentFixture<SubcourseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcourseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
