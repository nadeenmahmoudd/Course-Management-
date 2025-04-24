import { Component, ViewChild } from '@angular/core';
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

  constructor(private courseService: CourseService) {}

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
  }
  
  handleSaveSubcourse(subcourse: Subcourse) {
    if (this.isEditSub) {
      this.courseService.updateSubcourse(this.selectedCourseIdForSub, subcourse);
    } else {
      this.courseService.addSubcourse(this.selectedCourseIdForSub, subcourse);
    }
    this.displaySubcourseDialog = false;
  }

  deleteCourse(courseId: number) {
    this.courseService.deleteCourse(courseId);
  }
  
  deleteSubcourse(courseId: number, subcourseId: number) {
    this.courseService.deleteSubcourse(courseId, subcourseId);
  }
  



  expandedRowKeys: any = {};


  onRowExpand(event: any) {
    console.log('Row expanded:', event.data);
  }

  onRowCollapse(event: any) {
    console.log('Row collapsed:', event.data);
  }

  
}
