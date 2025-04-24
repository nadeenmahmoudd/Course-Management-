import { Subcourse } from "./subcourse";

export interface Course {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    subcourses: Subcourse[];
}
