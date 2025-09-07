# Copilot Instructions for classroom-ai

## Project Overview
- This is a React Native (Expo) app for classroom/course management, using TypeScript and Supabase for backend/auth.
- Main app code is in `app/` (uses Expo Router for navigation). Auth flows are in `app/(auth)/`, main features in `app/(tabs)/`.
- Contexts (global state, e.g. auth) are in `contexts/`. Supabase client config is in `lib/supabase.ts`.
- User profiles are managed in a `profiles` table in Supabase, linked to `auth.users`.

## Key Patterns & Conventions
- **Navigation:** Uses Expo Router. Route files/folders in `app/` map to screens. Layouts are in `_layout.tsx` files.
- **Authentication:**
  - Auth logic is in `contexts/AuthContext.tsx`.
  - Registration creates a Supabase user and a row in `profiles`.
  - RLS policies in Supabase restrict profile access to the owner.
- **Onboarding:**
  - New users see `app/Onboarding.tsx` before login/register.
  - Onboarding is conditionally rendered in `app/index.tsx`.
- **Frontend Protection:**
  - Registration disables the button and shows a spinner while processing, prevents rapid requests, and handles 429 errors with a friendly message.
- **Styling:**
  - Uses inline styles and `StyleSheet.create` from `react-native`.
  - Gradients via `expo-linear-gradient`.
- **Icons:**
  - Uses `lucide-react-native` for icons.

## Developer Workflows
- **Start app:** `npx expo start` (from project root)
- **Install deps:** `npm install` (uses `package.json`)
- **Type checking:** `tsc --noEmit`
- **Supabase:**
  - Backend config in `lib/supabase.ts`.
  - Update DB schema via Supabase dashboard/SQL editor.

## Integration Points
- **Supabase:** Used for auth, user management, and data storage. All API calls go through the `supabase` client.
- **AsyncStorage:** Used for local session management in `AuthContext.tsx`.

## Examples
- See `app/(auth)/register.tsx` for registration flow and error handling.
- See `contexts/AuthContext.tsx` for auth logic and Supabase integration.
- See `app/index.tsx` for onboarding logic and navigation control.

## Project Structure
- `app/` - All screens/routes
- `contexts/` - React context providers
- `lib/` - Supabase client setup
- `types/` - DB types (generated from Supabase)
- `assets/` - Images/icons

---

For new features, follow the patterns in `app/(tabs)/` and use context/hooks for shared state. Always handle Supabase errors and respect RLS policies.
