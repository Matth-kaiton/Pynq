import { Dimensions, StyleSheet } from "react-native";
import base from "./theme.json";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const modal = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: base.colors.surface,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
    minHeight: SCREEN_HEIGHT * 0.4,

    shadowColor: base.colors.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,

    elevation: 20,
  },

  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: base.colors.textSecondary,
    marginBottom: 20,
    paddingRight: 30, // Pour ne pas chevaucher le bouton X
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 5,
  },

  detailText: {
    fontSize: 16,
    color: base.colors.textSecondary,
    marginLeft: 12,
    flexShrink: 1, // Évite que le texte ne dépasse de l'écran
  },

  closeButton: {
    backgroundColor: base.colors.background,
    borderRadius: 10,
    padding: 10,
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
});
