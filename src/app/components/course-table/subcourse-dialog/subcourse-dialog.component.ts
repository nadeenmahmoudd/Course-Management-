import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subcourse } from '../../../models/subcourse';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { Course } from '../../../models/course';
@Component({
  selector: 'app-subcourse-dialog',
  imports: [DialogModule, TableModule , ButtonModule ,CommonModule , InputTextModule , FormsModule , ReactiveFormsModule  ],
  templateUrl: './subcourse-dialog.component.html',
  styleUrl: './subcourse-dialog.component.scss'
})
export class SubcourseDialogComponent implements OnInit , OnChanges{
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() isEdit: boolean = false;
  @Input() subcourse: Subcourse | null = null;

  @Output() onSave = new EventEmitter<Subcourse>();
  @Output() onCancel = new EventEmitter<void>();
  subcourseForm!: FormGroup;
@Input() course!: Course;
@Input() otherSubcourses: Subcourse[] = [];
@Input() subcourseErrorMessage: string = '';


constructor(private fb: FormBuilder) {}

ngOnInit() {
  this.initForm();
  this.subcourseForm.valueChanges.subscribe(() => {
    this.subcourseErrorMessage = '';
  });
  
}
private startBeforeEndValidator(control: AbstractControl): ValidationErrors | null {
  const start = new Date(control.get('startDate')?.value);
  const end = new Date(control.get('endDate')?.value);

  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  return end <= start ? { dateInvalid: true } : null;
}


private noOverlapValidator(control: AbstractControl): ValidationErrors | null {
  const start = new Date(control.get('startDate')?.value);
  const end = new Date(control.get('endDate')?.value);

  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  for (const sub of this.otherSubcourses) {
    const s = new Date(sub.startDate);
    const e = new Date(sub.endDate);
    if (start <= e && end >= s) {
      return { overlap: true };
    }
  }

  return null;
}
initForm() {
  this.subcourseForm = this.fb.group({
    name: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  }, {
    validators: Validators.compose([
      this.startBeforeEndValidator.bind(this),
      this.withinCourseRangeValidator.bind(this),
      this.noOverlapValidator.bind(this)
    ])
  });
}


openSubcourseDialog(course: Course, subcourseToEdit?: Subcourse) {
  this.course = course;

  if (subcourseToEdit) {
    this.isEdit = true;
    this.subcourseForm.patchValue(subcourseToEdit);
    this.subcourseForm.updateValueAndValidity();

    this.otherSubcourses = course.subcourses.filter(s => s.id !== subcourseToEdit.id);
  } else {
    this.isEdit = false;
    this.subcourseForm.reset();

    this.otherSubcourses = [...course.subcourses];
  }

  this.visible = true;
  
}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      this.initForm();
  
      if (this.subcourse) {
        this.subcourseForm.patchValue(this.subcourse);
      }
    }
  }
  
save() {
  this.subcourseForm.markAllAsTouched();
  this.subcourseForm.updateValueAndValidity();

  if (this.subcourseForm.invalid) {
    console.warn('Form has errors:', this.subcourseForm.errors);
    return; 
  }

  const subcourse = this.subcourseForm.value;
  console.log("Subcourse ", subcourse);

  this.onSave.emit(subcourse); 

  if (!subcourse.id) {
    subcourse.id = Date.now(); 
  }
  this.onSave.emit(subcourse);

  this.visibleChange.emit(false);
}


private withinCourseRangeValidator(group: AbstractControl): ValidationErrors | null {
  if (!this.course) return null;
  const start = new Date(group.get('startDate')?.value);
  const end = new Date(group.get('endDate')?.value);
  const courseStart = new Date(this.course.startDate);
  const courseEnd = new Date(this.course.endDate);

  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  return (start < courseStart || end > courseEnd)
    ? { outOfRange: true }
    : null;
}

  cancel() {
    this.visibleChange.emit(false);
    this.onCancel.emit();
  }

}
