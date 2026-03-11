import { Dimensions, StyleSheet } from "react-native";
import base from "./theme.json";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const modal = StyleSheet.create({
  // Le fond noir transparent qui couvre tout l'écran
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Noir à 60% d'opacité
    justifyContent: "flex-end", // Aligne la modal en bas
  },

  // Le contenu blanc de la modal
  modalContent: {
    backgroundColor: base.colors.surface,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
    minHeight: SCREEN_HEIGHT * 0.4, // Prend au moins 40% de l'écran
    // Ombre pour iOS
    shadowColor: base.colors.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // Ombre pour Android
    elevation: 20,
  },

  // La petite barre grise tout en haut pour faire style "poignée"
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
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
});
