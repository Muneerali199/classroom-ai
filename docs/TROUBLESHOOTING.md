# Troubleshooting Guide

## Common Issues and Solutions

### Authentication Issues

#### "Invalid login credentials"
- **Cause**: Incorrect email or password
- **Solution**: Double-check your email and password. Ensure Caps Lock is off.

#### "Email not confirmed"
- **Cause**: Email verification required
- **Solution**: Check your email for a confirmation link from Supabase.

#### "Too many requests"
- **Cause**: Rate limiting due to multiple failed login attempts
- **Solution**: Wait 15 minutes before trying again, or reset your password.

### Voice Interface Issues

#### "Recording start failure"
- **Cause**: Microphone permission denied or hardware issue
- **Solution**:
  1. Grant microphone permission in device settings
  2. Check if microphone is being used by another app
  3. Restart the app
  4. Test microphone in device settings

#### "Transcription failed"
- **Cause**: Network issues or invalid audio
- **Solution**:
  1. Check internet connection
  2. Speak clearly and closer to microphone
  3. Keep recordings under 60 seconds
  4. Try recording in a quieter environment

#### "Audio cleanup error"
- **Cause**: Recording object not properly initialized
- **Solution**: Restart the app and try recording again.

### App Performance Issues

#### "App is slow or unresponsive"
- **Cause**: Memory issues or background processes
- **Solution**:
  1. Close other apps
  2. Restart the device
  3. Clear app cache (Settings > Apps > Classroom AI > Storage > Clear Cache)
  4. Update to latest app version

#### "Data not syncing"
- **Cause**: Network connectivity issues
- **Solution**:
  1. Check internet connection
  2. Try switching between WiFi and mobile data
  3. Restart the app
  4. Check Supabase status at status.supabase.com

### Installation Issues

#### "Build failed"
- **Cause**: Missing dependencies or incompatible Node version
- **Solution**:
  1. Ensure Node.js version 18+ is installed
  2. Run `npm install` to install dependencies
  3. Clear npm cache: `npm cache clean --force`
  4. Delete node_modules and reinstall: `rm -rf node_modules && npm install`

#### "Metro bundler error"
- **Cause**: Port conflict or cache issues
- **Solution**:
  1. Kill Metro process: `npx react-native start --reset-cache`
  2. Change Metro port: `npx react-native start --port 8081`
  3. Clear watchman cache: `watchman watch-del-all`

### Database Issues

#### "Connection timeout"
- **Cause**: Network issues or Supabase downtime
- **Solution**:
  1. Check internet connection
  2. Verify Supabase project is active
  3. Check Supabase status page
  4. Try again later

#### "Permission denied"
- **Cause**: Insufficient user permissions
- **Solution**:
  1. Ensure you're logged in with correct role
  2. Contact administrator if you need elevated permissions
  3. Check Row Level Security policies

### Expo Development Issues

#### "Expo Go not connecting"
- **Cause**: Network configuration or firewall
- **Solution**:
  1. Ensure device and computer are on same network
  2. Disable firewall temporarily
  3. Try using tunnel: `npx expo start --tunnel`
  4. Restart Expo CLI

#### "Build stuck at certain percentage"
- **Cause**: Network timeout or resource constraints
- **Solution**:
  1. Check internet connection stability
  2. Try building again
  3. Use `--clear` flag for clean build
  4. Check available disk space

### Platform-Specific Issues

#### iOS Issues
- **Microphone permission**: Settings > Privacy & Security > Microphone > Enable for Classroom AI
- **Notification permission**: Settings > Notifications > Classroom AI > Allow Notifications
- **Location permission**: Settings > Privacy & Security > Location Services > Enable for Classroom AI

#### Android Issues
- **Microphone permission**: Settings > Apps > Classroom AI > Permissions > Microphone > Allow
- **Notification permission**: Settings > Apps > Classroom AI > Notifications > Allow
- **Location permission**: Settings > Apps > Classroom AI > Permissions > Location > Allow

### Development Issues

#### "TypeScript errors"
- **Cause**: Type mismatches or missing type definitions
- **Solution**:
  1. Run `npx tsc --noEmit` to check for errors
  2. Install missing @types packages
  3. Update TypeScript version
  4. Check for breaking changes in dependencies

#### "ESLint errors"
- **Cause**: Code style violations
- **Solution**:
  1. Run `npm run lint` to see all errors
  2. Fix errors according to ESLint rules
  3. Configure rules in `.eslintrc.js` if needed
  4. Use `npm run lint -- --fix` for auto-fixable issues

### Getting Help

If you can't resolve an issue:

1. Check the [GitHub Issues](https://github.com/your-repo/issues) for similar problems
2. Create a new issue with:
   - Device/OS information
   - App version
   - Steps to reproduce
   - Error messages/logs
   - Screenshots if applicable
3. Contact support at support@classroom-ai.com

### Logs and Debugging

#### Enable Debug Mode
```javascript
// In development, set DEBUG=true in .env
DEBUG=true
```

#### View Logs
- **iOS**: Xcode > Window > Devices and Simulators > Select device > Open Console
- **Android**: Android Studio > Logcat
- **Expo**: Use `console.log()` statements, view in terminal or Expo DevTools

#### Common Debug Commands
```bash
# Clear all caches
npx react-native start --reset-cache
npm cache clean --force
watchman watch-del-all

# Reinstall dependencies
rm -rf node_modules
npm install

# Clean iOS build
cd ios && rm -rf build && cd ..
npx react-native run-ios

# Clean Android build
cd android && ./gradlew clean && cd ..
npx react-native run-android
