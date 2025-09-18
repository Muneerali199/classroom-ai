# Classroom AI API Documentation

## Overview

Classroom AI uses Supabase as its backend service, providing real-time database functionality and authentication. The API is organized around RESTful principles with real-time subscriptions.

## Authentication

All API requests require authentication via Supabase JWT tokens. The app handles authentication automatically through the AuthContext.

### Authentication Flow
1. User logs in via `supabase.auth.signInWithPassword()`
2. JWT token is stored automatically
3. All subsequent requests include the token
4. Token is refreshed automatically

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Courses Table
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  teacher_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Activities Table
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  activity_id UUID REFERENCES activities(id),
  status TEXT CHECK (status IN ('present', 'absent', 'late')),
  check_in_time TIMESTAMP,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  enrolled_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Authentication
- `POST /auth/v1/token` - Login/Signup
- `POST /auth/v1/logout` - Logout
- `GET /auth/v1/user` - Get current user

### Profiles
- `GET /rest/v1/profiles` - List profiles
- `GET /rest/v1/profiles/{id}` - Get profile by ID
- `POST /rest/v1/profiles` - Create profile
- `PATCH /rest/v1/profiles/{id}` - Update profile
- `DELETE /rest/v1/profiles/{id}` - Delete profile

### Courses
- `GET /rest/v1/courses` - List courses
- `GET /rest/v1/courses/{id}` - Get course by ID
- `POST /rest/v1/courses` - Create course
- `PATCH /rest/v1/courses/{id}` - Update course
- `DELETE /rest/v1/courses/{id}` - Delete course

### Activities
- `GET /rest/v1/activities` - List activities
- `GET /rest/v1/activities/{id}` - Get activity by ID
- `POST /rest/v1/activities` - Create activity
- `PATCH /rest/v1/activities/{id}` - Update activity
- `DELETE /rest/v1/activities/{id}` - Delete activity

### Attendance
- `GET /rest/v1/attendance` - List attendance records
- `GET /rest/v1/attendance/{id}` - Get attendance by ID
- `POST /rest/v1/attendance` - Mark attendance
- `PATCH /rest/v1/attendance/{id}` - Update attendance
- `DELETE /rest/v1/attendance/{id}` - Delete attendance

### Enrollments
- `GET /rest/v1/enrollments` - List enrollments
- `GET /rest/v1/enrollments/{id}` - Get enrollment by ID
- `POST /rest/v1/enrollments` - Create enrollment
- `DELETE /rest/v1/enrollments/{id}` - Delete enrollment

## Real-time Subscriptions

Classroom AI uses Supabase real-time subscriptions for live updates:

```javascript
// Subscribe to attendance changes
const subscription = supabase
  .channel('attendance_changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'attendance' },
    (payload) => {
      console.log('Attendance change:', payload);
    }
  )
  .subscribe();
```

## Error Handling

All API calls return standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a JSON object with `error` and `message` fields.

## Rate Limiting

API requests are rate-limited to prevent abuse:
- 1000 requests per hour for authenticated users
- 100 requests per hour for unauthenticated users

## Security

- All data transmission uses HTTPS
- JWT tokens expire after 1 hour
- Sensitive data is encrypted at rest
- Row Level Security (RLS) policies enforce data access control
