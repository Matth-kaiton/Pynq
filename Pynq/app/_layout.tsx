import 'react-native-reanimated';

import * as Calendar from 'expo-calendar';
import { useEffect } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';

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

  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      <Button title="Create a new calendar" onPress={createCalendar} />
    </View>
  );
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
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
