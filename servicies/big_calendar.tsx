import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-big-calendar";

export let event = [
  {
    title: "",
    start: new Date(),
    end: new Date(),
  },
];

export function ShowCalendar() {
  const [calendarEvent, setCalendarData] = useState(event);

  useFocusEffect(
    useCallback(() => {
      setCalendarData([...event]);
    }, []),
  );
  return (
    <View style={styles.container}>
      <Calendar
        events={calendarEvent}
        height={600}
        mode="3days"
        swipeEnabled={true}
        onPressEvent={(e) => console.log(e)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    width: "100%",
    paddingTop: 50,
  },
});

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
    })
  ).current;

  return (
    <View style={styles.container}>
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   card: {
//     width: 250,
//     height: 150,
//     backgroundColor: "#4a90e2",
//     borderRadius: 15,
//   },
// });
