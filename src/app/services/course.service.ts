import { Injectable } from '@angular/core';
import { Course } from '../models/course';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subcourse } from '../models/subcourse';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [
    // {
    //   id: 1,
    //   name: "Course 1",
    //   startDate: new Date('2025-01-01'),
    //   endDate: new Date('2025-12-31'),
    //   subcourses: [{
    //     id: 1,
    //     name: "Subcourse 1",
    //     startDate: new Date('2025-05-01'), 
    //     endDate: new Date('2025-06-01'),
    //     courseId: 1
    //   }, {
    //     id: 2,
    //     name: "Subcourse 2",
    //     startDate: new Date('2025-07-01'),
    //     endDate: new Date('2025-08-01'),
    //     courseId: 1
    //   }]
    // } ,
    // {
    //   id: 1,
    //   name: "Course 2",
    //   startDate: new Date('2025-01-01'),
    //   endDate: new Date('2025-12-31'),
    //   subcourses: [{
    //     id: 1,
    //     name: "Subcourse 1",
    //     startDate: new Date('2025-05-05'), 
    //     endDate: new Date('2025-06-01'),
    //     courseId: 1
    //   }, {
    //     id: 2,
    //     name: "Subcourse 2",
    //     startDate: new Date('2025-07-01'),
    //     endDate: new Date('2025-08-01'),
    //     courseId: 1
    //   }]
    // }
  ];
  private coursesSubject = new BehaviorSubject<Course[]>(this.courses);

  constructor() {}

  getCourses(): Observable<Course[]> {
    return this.coursesSubject.asObservable();
  }

  addCourse(course: Course): void {
    course.id = this.generateCourseId();
    course.subcourses = [];
    this.courses.push(course);
    this.coursesSubject.next(this.courses);
  }

  updateCourse(updatedCourse: Course): void {
    const index = this.courses.findIndex(c => c.id === updatedCourse.id);
    if (index !== -1) {
      this.courses[index] = { ...updatedCourse };
      this.coursesSubject.next(this.courses);
    }
  }

  addSubcourse(courseId: number, subcourse: Subcourse): void {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      subcourse.id = this.generateSubcourseId(course);
      subcourse.courseId = courseId;
      course.subcourses.push(subcourse);
      this.coursesSubject.next(this.courses);
    }
  }

  updateSubcourse(courseId: number, updatedSub: Subcourse): void {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      const index = course.subcourses.findIndex(s => s.id === updatedSub.id);
      if (index !== -1) {
        course.subcourses[index] = { ...updatedSub };
        this.coursesSubject.next(this.courses);
      }
    }
  }

  deleteCourse(courseId: number): void {
    this.courses = this.courses.filter(c => c.id !== courseId);
    this.coursesSubject.next(this.courses);
  }

  deleteSubcourse(courseId: number, subcourseId: number): void {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      course.subcourses = course.subcourses.filter(s => s.id !== subcourseId);
      this.coursesSubject.next(this.courses);
    }
  }
    
  private generateCourseId(): number {
    return this.courses.length > 0 ? Math.max(...this.courses.map(c => c.id)) + 1 : 1;
  }

  private generateSubcourseId(course: Course): number {
    return course.subcourses.length > 0 ? Math.max(...course.subcourses.map(s => s.id)) + 1 : 1;
  }
}
