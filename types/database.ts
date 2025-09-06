export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'student' | 'teacher' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: 'student' | 'teacher' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'student' | 'teacher' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          teacher_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          teacher_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          teacher_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          due_date: string | null
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          due_date?: string | null
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          activity_id: string
          status: 'present' | 'absent' | 'late'
          check_in_time: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          activity_id: string
          status: 'present' | 'absent' | 'late'
          check_in_time?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          activity_id?: string
          status?: 'present' | 'absent' | 'late'
          check_in_time?: string | null
          location?: string | null
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrolled_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrolled_at?: string
        }
      }
    }
  }
}