import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TimetableMainScreen from './TimetableMainScreen';

const Stack = createNativeStackNavigator();

export default function TimetableGeneratorNavigator() {
  return (
    <Stack.Navigator initialRouteName="TimetableMain">
      <Stack.Screen name="TimetableMain" component={TimetableMainScreen} options={{ title: 'Timetable Generator' }} />
    </Stack.Navigator>
  );
}
