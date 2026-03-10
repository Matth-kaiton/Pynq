import { Calendar } from "react-native-big-calendar";
import { StyleSheet, View, Animated, PanResponder } from "react-native";
import { use, useEffect, useRef } from "react";

const events = [
  {
    title: "Meeting",
    start: new Date(2025, 11, 2, 10, 0),
    end: new Date(2025, 11, 2, 10, 30),
  },
  {
    title: "Coffee break",
    start: new Date(2025, 11, 3, 0, 0),
    end: new Date(2026, 11, 12, 0, 0),
  },
  {
    title: "Lunch",
    start: new Date(2025, 11, 5, 0, 0),
    end: new Date(2025, 11, 5, 0, 0),
  }
];

export function ShowCalendar() {
  return (
    <View style={styles.container}>
      <Calendar events={events} height={600} mode="month" swipeEnabled={true} onPressEvent={(e) => console.log(e)} />
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
