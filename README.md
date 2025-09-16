# Classroom AI

Classroom AI is a secure, institution-controlled educational management platform built with Expo React Native. It provides real-time attendance tracking, role-based permissions, dean-supervised access, analytics, chatbot, voice interface, course management, grades, and reports to streamline educational workflows for students, teachers, and administrators.

## Key Features

- Real-time attendance marking with instant synchronization
- Role-based access control (Student, Teacher, Admin)
- Dean-supervised user creation and institutional oversight
- Comprehensive analytics and reporting dashboards
- Chatbot and voice interface for enhanced user interaction
- Course, class, schedule, grades, and attendance management
- Secure data privacy and encryption
- Mobile-first design with offline capabilities

## Tech Stack

- React Native (Expo) with TypeScript
- Expo Router for navigation
- Supabase for backend and authentication
- Prisma ORM with PostgreSQL database
- React Query for server state management
- Various Expo modules: Camera, Notifications, Localization, etc.
- Lucide Icons for UI icons
- AsyncStorage for local data persistence

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd classroom-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase URL and anon key:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open the Expo app on your device or emulator to view the app.

## Usage

- Login as Student, Teacher, or Admin
- Navigate through tabs: Profile, Classes, Schedule, Attendance, Grades, Reports, Analytics, Chatbot, About
- Use voice interface for hands-free interaction
- Manage courses, mark attendance, view analytics, and more

## Project Structure

- `app/` - Main application screens and navigation
- `components/` - Reusable UI components (e.g., VoiceInterface)
- `contexts/` - React contexts for auth, theme, localization
- `constants/` - Static data like dashboard stats, tech stack
- `lib/` - Supabase client and utilities
- `prisma/` - Database schema and migrations
- `hooks/` - Custom React hooks
- `assets/` - Images and icons

## Database Schema

The project uses Prisma ORM with PostgreSQL. Key models include:

- **Profile**: User profiles with roles (student, teacher, admin)
- **Course**: Courses taught by teachers
- **Activity**: Activities and assignments within courses
- **Attendance**: Student attendance records for activities
- **Enrollment**: Student enrollments in courses

## Contributing

Contributions are welcome! Please open issues or submit pull requests for bug fixes, features, or documentation improvements.

## License

This project is licensed under the MIT License.

---

For more details, refer to the in-app About section and inline code documentation.
