import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Course } from '../../models/course';
import { CourseService } from '../../services/course.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CourseDialogComponent } from "./course-dialog/course-dialog.component";
import { Subcourse } from '../../models/subcourse';
import { SubcourseDialogComponent } from "./subcourse-dialog/subcourse-dialog.component";
import { AccordionModule } from 'primeng/accordion';




@Component({
  selector: 'app-course-table',
  standalone:true,
  imports: [CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    CourseDialogComponent, SubcourseDialogComponent, AccordionModule],
  templateUrl: './course-table.component.html',
  styleUrl: './course-table.component.scss'
})
export class CourseTableComponent {
[x: string]: any;
  courses: Course[] = [];
  selectedCourseIdForSub!: number;
  selectedSubcourse: Subcourse | null = null;
  displaySubcourseDialog: boolean = false;
  isEditSub: boolean = false;
  selectedCourse: Course | null = null;

  @ViewChild('subcourseDialog') subcourseDialogComponent!: SubcourseDialogComponent;

  constructor(private courseService: CourseService , private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
      console.log('Courses:', this.courses); 
    });
   
  }
  displayDialog: boolean = false;
  isEdit: boolean = false;

  handleSaveCourse(course: Course) {
    if (this.isEdit) {
      this.courseService.updateCourse(course);
    } else {
      this.courseService.addCourse(course);
    }
    this.displayDialog = false;
    
  }

  openAddCourseDialog() {
    this.isEdit = false;
    this.displayDialog = true;
    this.selectedCourse = null;
  }
  
 
  openEditCourseDialog(course: Course) {
    this.isEdit = true;
    this.selectedCourse = { ...course }; 
    this.displayDialog = true;
  }
  
  
  openAddSubcourseDialog(course: Course) {
    this.selectedCourseIdForSub = course.id;
    this.selectedSubcourse = null;
    this.isEditSub = false;
    this.subcourseErrorMessage = '';
    this.displaySubcourseDialog = true;
  
    setTimeout(() => {
      this.subcourseDialogComponent?.subcourseForm?.reset();
    });
  }
  

  openEditSubcourseDialog(course: Course, subcourse: Subcourse) {
    this.selectedCourseIdForSub = course.id;
    this.selectedSubcourse = { ...subcourse };
    this.isEditSub = true;
    this.displaySubcourseDialog = true;
    this.subcourseErrorMessage = '';
  }
  
 

  deleteCourse(courseId: number) {
    this.courseService.deleteCourse(courseId);
  }
  
  deleteSubcourse(courseId: number, subcourseId: number) {
    this.courseService.deleteSubcourse(courseId, subcourseId);
  }

  subcourseErrorMessage: string = '';
  

  handleSaveSubcourse(subcourse: Subcourse) {
    const parentCourse = this.courses.find(c => c.id === this.selectedCourseIdForSub);
    if (!parentCourse) return;
  
    const subStart = new Date(subcourse.startDate);
    const subEnd = new Date(subcourse.endDate);
    const courseStart = new Date(parentCourse.startDate);
    const courseEnd = new Date(parentCourse.endDate);
  
    // Overlapping validation
    const existingSubcourses = parentCourse.subcourses || [];
    const isOverlapping = existingSubcourses.some(sc => {
      if (this.isEditSub && sc.id === subcourse.id) return false; 
  
      const existingStart = new Date(sc.startDate);
      const existingEnd = new Date(sc.endDate);
  
      return (
        (subStart < existingEnd && subEnd > existingStart) 
      );
    });



if (subStart >= subEnd) {
  this.subcourseErrorMessage = "Subcourse start date must be before end date.";
  return;
}

if (subStart < courseStart || subEnd > courseEnd) {
  this.subcourseErrorMessage = "Subcourse dates must fall within the parent course’s date range.";
  return;
}

if (isOverlapping) {
  this.subcourseErrorMessage = "This subcourse overlaps with another subcourse under the same course.";
  return;
}

    if (this.isEditSub) {
      this.courseService.updateSubcourse(this.selectedCourseIdForSub, subcourse);
    } else {
      this.courseService.addSubcourse(this.selectedCourseIdForSub, subcourse);
    }
  
    this.displaySubcourseDialog = false;

    const subcourseIndex = parentCourse.subcourses.findIndex(sc => sc.id === subcourse.id);
    if (subcourseIndex !== -1) {
      parentCourse.subcourses[subcourseIndex] = subcourse; 
    }
      this.courses = [...this.courses]; 
  
  this.subcourseErrorMessage = ''; 

  this.displaySubcourseDialog = false;
  }

  
  expandedRowKeys: any = {};


  onRowExpand(event: any) {
    console.log('Row expanded:', event.data);
  }

  onRowCollapse(event: any) {
    console.log('Row collapsed:', event.data);
  }
  
}
