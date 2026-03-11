import { CreateEvent } from "@/app/(tabs)/createEvent";
import { modal } from "@/style/modal";
import { styles } from "@/style/style";
import base from "@/style/theme.json";
import { useFocusEffect } from "@react-navigation/native";
import { AlignLeft, Clock, X } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  PanResponder,
  Pressable,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-big-calendar";
import { getRemoteEvents } from "./db_queries";

interface ShowCalendarProps {
  selectedGroupId?: string;
}

export function ShowCalendar({ selectedGroupId }: ShowCalendarProps) {
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Mis à false pour l'exemple
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [createDate, setCreateDate] = useState(new Date());
  const [isCreatModalVisible, setIsCreatModalVisible] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;

  const refreshData = async () => {
    setLoading(true);
    const data = await getRemoteEvents();
    setCalendarEvents(data);
    setIsCreatModalVisible(false); // Ferme la modal
    setLoading(false);
  };

  const panResponder = useRef(
    PanResponder.create({
      // On s'active seulement si le mouvement est horizontal
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20,

      onPanResponderMove: Animated.event(
        [null, { dx: translateX }],
        { useNativeDriver: false }, // Obligatoire pour transformer pendant le mouvement
      ),

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -100) {
          // SWIPE GAUCHE -> ALLER VERS LE FUTUR (Date + 3)
          Animated.timing(translateX, {
            toValue: -500,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            setSelectedDate((prevDate) => {
              const next = new Date(prevDate);
              next.setDate(next.getDate() + 3);
              return next;
            });

            // Téléportation à droite et retour fluide
            translateX.setValue(500);
            Animated.spring(translateX, {
              toValue: 0,
              friction: 8,
              useNativeDriver: true,
            }).start();
          });
        } else if (gestureState.dx > 100) {
          // SWIPE DROITE -> ALLER VERS LE PASSÉ (Date - 3)
          Animated.timing(translateX, {
            toValue: 500,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            setSelectedDate((prevDate) => {
              const prev = new Date(prevDate);
              prev.setDate(prev.getDate() - 3);
              return prev;
            });

            // Téléportation à gauche et retour fluide
            translateX.setValue(-500);
            Animated.spring(translateX, {
              toValue: 0,
              friction: 8,
              useNativeDriver: true,
            }).start();
          });
        } else {
          // REVENIR AU CENTRE SI PAS ASSEZ LOIN
          Animated.spring(translateX, {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const loadData = async () => {
        setLoading(true);
        const data = await getRemoteEvents(selectedGroupId);
        if (isActive) {
          setCalendarEvents(data);
          setLoading(false);
        }
      };
      loadData();
      return () => {
        isActive = false;
      };
    }, [selectedGroupId]),
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
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: translateX }],
        }}
        {...panResponder.panHandlers}
      >
        <Calendar
          date={selectedDate}
          events={calendarEvents}
          height={600}
          onPressCell={(event) => {
            setCreateDate(event);
            setIsCreatModalVisible(true);
          }}
          mode="3days"
          swipeEnabled={false}
          onPressEvent={(event) => {
            setSelectedEvent(event);
            setIsModalVisible(true);
          }}
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
      </Animated.View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={modal.modalOverlay}>
          <View style={modal.modalContent}>
            {/* Bouton Fermer */}
            <Pressable
              style={modal.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <X color={base.colors.textSecondary} size={24} />
            </Pressable>

            {/* Titre de l'événement */}
            <Text style={modal.modalTitle}>{selectedEvent?.title}</Text>

            {/* Horaires */}
            <View style={modal.detailRow}>
              <Clock size={20} color={base.colors.primary} />
              <Text style={modal.detailText}>
                {selectedEvent?.start?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {selectedEvent?.end?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            {/* Description (si elle existe dans tes données) */}
            {selectedEvent?.description && (
              <View style={modal.detailRow}>
                <AlignLeft size={20} color={base.colors.primary} />
                <Text style={modal.detailText}>
                  {selectedEvent.description}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCreatModalVisible}
        onRequestClose={() => setIsCreatModalVisible(false)}
      >
        <View style={modal.modalOverlay}>
          <Pressable
            style={modal.closeButton}
            onPress={() => setIsCreatModalVisible(false)}
          >
            <X color={base.colors.textSecondary} size={24} />
          </Pressable>
          <CreateEvent initialDate={createDate} onSuccess={refreshData} />
        </View>
      </Modal>
    </View>
  );
}
