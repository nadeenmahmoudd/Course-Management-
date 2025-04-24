import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Course } from '../../../models/course';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-course-dialog',
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './course-dialog.component.html',
  styleUrl: './course-dialog.component.scss',
})
export class CourseDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() isEdit: boolean = false;
  @Input() courseData: Course | null = null;
  @Input() course: Course | null = null;
  @Output() onSave = new EventEmitter<Course>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['course'] && this.courseForm) {
      if (this.isEdit && this.course) {
        this.courseForm.patchValue(this.course);
      } else {
        this.courseForm.reset(); 
      }
    }
  }
  courseForm!: FormGroup;

  constructor(private fb: FormBuilder) {}
  
  ngOnInit() {
    this.initForm();
  }
  
  initForm() {
    this.courseForm = this.fb.group({
      id: [this.course?.id ?? 0],
      name: [this.course?.name ?? '', Validators.required],
      startDate: [this.course?.startDate ?? '', Validators.required],
      endDate: [this.course?.endDate ?? '', [Validators.required]],
    }, { validators: this.validateCourseDates });
  }
  
  validateCourseDates(form: AbstractControl) {
    const start = new Date(form.get('startDate')?.value);
    const end = new Date(form.get('endDate')?.value);
    if (!start || !end) return null;
    return end > start ? null : { dateInvalid: true };
  }
  
  save() {
    if (this.courseForm.valid) {
      const updatedCourse: Course = {
        ...this.courseForm.value,
        subcourses: this.course?.subcourses || []
      };
      this.onSave.emit(updatedCourse);
      this.visibleChange.emit(false);
    } else {
      this.courseForm.markAllAsTouched();
    }
  }
  
  cancel() {
    this.visibleChange.emit(false);
  }
}
