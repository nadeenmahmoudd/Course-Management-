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

constructor(private fb: FormBuilder) {}

ngOnInit() {
  this.initForm();
}

initForm() {
  this.subcourseForm = this.fb.group({
    name: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  }, {   validators: this.validateSubcourseDates.bind(this)
  });
}



validateSubcourseDates(form: AbstractControl): ValidationErrors | null {
  const start = new Date(form.get('startDate')?.value);
  const end = new Date(form.get('endDate')?.value);
  const courseStart = new Date(this.course?.startDate);
  const courseEnd = new Date(this.course?.endDate);

  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return null;
  }

  if (end <= start) return { dateInvalid: true };
  if (start < courseStart || end > courseEnd) return { outOfRange: true };

  for (const sub of this.otherSubcourses) {
    if (sub.startDate && sub.endDate) {
      const s = new Date(sub.startDate);
      const e = new Date(sub.endDate);

      const isOverlapping = start <= e && end >= s;
      if (isOverlapping) return { overlap: true };
    }
  }

  return null;
}


openSubcourseDialog(course: Course, subcourseToEdit?: Subcourse) {
  this.course = course;

  if (subcourseToEdit) {
    this.isEdit = true;
    this.subcourseForm.patchValue(subcourseToEdit);

    // ⬇️ أهم حاجة هنا:
    this.otherSubcourses = course.subcourses.filter(s => s.id !== subcourseToEdit.id);
  } else {
    this.isEdit = false;
    this.subcourseForm.reset();

    // ⬇️ لما تكوني بتضيفي جديد، يبقى كل الـ subcourses هما الـ others
    this.otherSubcourses = [...course.subcourses];
  }

  this.visible = true;
}


  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['subcourse'] && this.subcourseForm) {
  //     if (this.subcourse) {
  //       this.subcourseForm.patchValue(this.subcourse); 
  //     } else {
  //       this.subcourseForm.reset(); 
  //     }
  //   }
  // }
  
  ngOnChanges(changes: SimpleChanges) {
    if ((changes['course'] || changes['subcourse'] || changes['otherSubcourses']) && this.course) {
      this.initForm();
  
      if (this.subcourse) {
        this.subcourseForm.patchValue(this.subcourse);
      }
    }
  }
  

  save() {
    if (this.subcourseForm.valid) {
      const data: Subcourse = {
        ...this.subcourse,
        ...this.subcourseForm.value
      };
      this.onSave.emit(data);
      this.visibleChange.emit(false);
    } else {
      this.subcourseForm.markAllAsTouched();
    }
  }

  cancel() {
    this.visibleChange.emit(false);
    this.onCancel.emit();
  }

}
