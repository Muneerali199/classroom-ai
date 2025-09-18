export interface Class {
  id: string;
  name: string;
  batch: string;
  semester: string;
  department: string;
  studentCount: number;
  subjects: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  type: 'lecture' | 'lab' | 'tutorial';
  facultyId: string;
  maxClassesPerWeek: number;
  maxClassesPerDay: number;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  availability: {
    [day: string]: {
      start: string;
      end: string;
      breaks: string[];
    };
  };
  leaveDays: number;
}

export interface Room {
  id: string;
  name: string;
  type: 'classroom' | 'lab' | 'auditorium';
  capacity: number;
  equipment: string[];
  availability: {
    [day: string]: {
      start: string;
      end: string;
      breaks: string[];
    };
  };
}

export interface TimetableSlot {
  id: string;
  day: string;
  time: string;
  duration: number;
  subjectId: string;
  facultyId: string;
  roomId: string;
  classId: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface Timetable {
  id: string;
  title: string;
  description: string;
  department: string;
  semester: string;
  year: string;
  shift: 'MORNING' | 'EVENING';
  slots: TimetableSlot[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Conflict {
  id: string;
  type: 'room' | 'faculty' | 'class';
  severity: 'high' | 'medium' | 'low';
  description: string;
  slotIds: string[];
  suggestion?: string;
}

export interface TimetableState {
  classes: Class[];
  subjects: Subject[];
  faculty: Faculty[];
  rooms: Room[];
  currentTimetable: Timetable | null;
  conflicts: Conflict[];
  isLoading: boolean;
  error: string | null;
}
