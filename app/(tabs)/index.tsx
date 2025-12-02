import 'react-native-reanimated';

import { useAuth } from '@/components/AuthContext';
import { getEvent } from '@/servicies/GetCalandar';
import * as Calendar from 'expo-calendar';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';


async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function deleteExpoCalendars() {
  try {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    let deletedCount = 0;
    for (const calendar of calendars) {
      if (calendar.title === 'Expo Calendar') {
        await Calendar.deleteCalendarAsync(calendar.id);
        console.log(`Deleted calendar with id: ${calendar.id}`);
        deletedCount++;
      }
    }
    console.log(`Deleted ${deletedCount} calendars.`);
  } catch (err) {
    console.error('deleteCalendars failed', err);
  }
}

async function createCalendar() {
  try {
    let source;
    if (Platform.OS === 'ios') {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      source = defaultCalendar?.source ?? { name: 'Expo Calendar', isLocalAccount: true };
    } else {
      source = { isLocalAccount: true, name: 'Expo Calendar' };
    }

    const calendarParams: any = {
      title: 'Expo Calendar',
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      name: 'internalCalendarName',
      source,
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER, // required
    };

    if (Platform.OS === 'ios') {
      if (source && typeof (source as any).id !== 'undefined') {
        calendarParams.sourceId = (source as any).id;
      }
      calendarParams.ownerAccount = 'personal';
    }

    const newCalendarID = await Calendar.createCalendarAsync(calendarParams);
    console.log(`Your new calendar ID is: ${newCalendarID}`);
  } catch (err) {
    console.error('createCalendar failed', err);
  }
}

export default function CalendarScreen() {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out');
      router.replace('../login');
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        console.log('Here are all event:');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      <Text>User: {user ? user.email : 'No user signed in'}</Text>
      <Button title="Sign out" onPress={handleSignOut} />
      <Button title="Get Event" onPress={getEvent}/>
      <Button title="Create a new calendar" onPress={createCalendar} />
      <Button title="Delete Expo Calendars" onPress={deleteExpoCalendars} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
