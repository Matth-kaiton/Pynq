import { styles } from "@/style/style";
import base from "@/style/theme.json";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState, useRef } from "react";
import { ActivityIndicator,Animated,PanResponder,View } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { getRemoteEvents } from "./GetCalandar";

export function ShowCalendar() {
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const loadData = async () => {
        setLoading(true);
        const data = await getRemoteEvents();
        if (isActive) {
          setCalendarEvents(data);
          setLoading(false);
        }
      };
      loadData();
      return () => {
        isActive = false;
      };
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.calendar}>
      <Calendar
        events={calendarEvents}
        height={600}
        mode="3days"
        swipeEnabled={true}
        onPressEvent={(e) => console.log(e)}
        theme={{
          palette: {
            primary: {
              main: base.colors.border,
              contrastText: base.colors.shadow,
            },
            gray: {
              "200": base.colors.border,
              "500": base.colors.secondary,
              "800": base.colors.secondary,
            },
          },
        }}
        hourStyle={{
          color: base.colors.secondary,
        }}
      />
    </View>
  );
}

export default function SwipeCard() {
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: 0 });
      },

      onPanResponderRelease: (evt, gestureState) => {
        // si swipé assez loin, on complète le swipe
        if (gestureState.dx > 120) {
          Animated.timing(position, {
            toValue: { x: 500, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
        // swipe vers la gauche
        else if (gestureState.dx < -120) {
          Animated.timing(position, {
            toValue: { x: -500, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
        // sinon, retour au centre
        else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.calendar}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            transform: [{ translateX: position.x }],
          },
        ]}
      />
    </View>
  );
}
