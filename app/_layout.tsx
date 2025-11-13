import 'react-native-reanimated';

import * as Calendar from 'expo-calendar';
import { useEffect } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
    })();
  }, []);

  // TODO FIX AuthContext usage
  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      <Button title="Sign out" onPress={AuthContext.signOut} />  {/* TODO FIX */}
      <Button title="Create a new calendar" onPress={createCalendar} />
      <Button title="Delete Expo Calendars" onPress={deleteExpoCalendars} />
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
