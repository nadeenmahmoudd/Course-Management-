import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CourseTableComponent } from "./components/course-table/course-table.component";

@Component({
  selector: 'app-root',
  imports: [ CourseTableComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'course-management';
}
