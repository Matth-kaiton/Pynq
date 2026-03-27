import { ThemedText } from "@/components/themed-text";
import { createGroup, joinGroup, getUserGroups } from "@/servicies/db_queries";
import { styles } from "@/style/style";
import { JSX, useState } from "react";
import {
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { setGroups, selectGroup } from "../app/(tabs)/index";

async function addGroupToList(id: string) {
  const userGroups = await getUserGroups();
  setGroups(userGroups);
  const newGroup = userGroups.find((g) => g.id === id);
  if (newGroup) selectGroup(newGroup);
}

function formCreateGroup(
  groupName: string,
  setGroupName: (text: string) => void,
  groupDescription: string,
  setGroupDescription: (text: string) => void,
  setCreatingGroup: (creating: boolean) => void,
  setModalVisible: (visible: boolean) => void,
) {
  return (
    <View>
      <ThemedText style={[styles.label, { fontSize: 18, marginBottom: 15 }]}>
        Créer un groupe
      </ThemedText>

      <TextInput
        style={[styles.input, { color: "#000" }]}
        placeholder="Nom du groupe"
        placeholderTextColor="#999"
        value={groupName}
        onChangeText={setGroupName}
      />

      <TextInput
        style={[styles.input, { color: "#000" }]}
        placeholder="Description"
        placeholderTextColor="#999"
        value={groupDescription}
        onChangeText={setGroupDescription}
      />

      <Pressable
        style={styles.button}
        onPress={async () => {
          const result = await createGroup(groupName, groupDescription);
          if (result.success) await addGroupToList(result.id);
          setModalVisible(false);
        }}
      >
        <ThemedText>Créer</ThemedText>
      </Pressable>

      <TouchableOpacity
        onPress={() => setCreatingGroup(false)}
        style={{ marginTop: 15, alignItems: "center" }}
      >
        <ThemedText style={{ color: "#007AFF" }}>
          Rejoindre un groupe
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function formJoinGroup(
  inviteId: string,
  setInviteId: (text: string) => void,
  setCreatingGroup: (creating: boolean) => void,
  setModalVisible: (visible: boolean) => void,
) {
  return (
    <View>
      <ThemedText style={[styles.label, { fontSize: 18, marginBottom: 15 }]}>
        Rejoindre un groupe
      </ThemedText>

      <TextInput
        style={[styles.input, { color: "#000" }]}
        placeholder="Invite ID"
        placeholderTextColor="#999"
        value={inviteId}
        onChangeText={setInviteId}
      />

      <Pressable
        style={styles.button}
        onPress={async () => {
          const result = await joinGroup(inviteId);
          if (result.success) await addGroupToList(result.id);
          setModalVisible(false);
        }}
      >
        <ThemedText>Rejoindre</ThemedText>
      </Pressable>

      <TouchableOpacity
        onPress={() => setCreatingGroup(true)}
        style={{ marginTop: 15, alignItems: "center" }}
      >
        <ThemedText style={{ color: "#007AFF" }}>Créer un groupe</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

export default function GroupModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [inviteId, setInviteId] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  let form: JSX.Element;

  if (creatingGroup) {
    form = formCreateGroup(
      groupName,
      setGroupName,
      groupDescription,
      setGroupDescription,
      setCreatingGroup,
      setModalVisible,
    );
  } else {
    form = formJoinGroup(
      inviteId,
      setInviteId,
      setCreatingGroup,
      setModalVisible,
    );
  }

  return (
    <View>
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <ThemedText>Rejoindre ou créer un groupe</ThemedText>
      </Pressable>

      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "70%",
            }}
          >
            {form}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 15, alignItems: "center" }}
            >
              <ThemedText style={{ color: "red" }}>Annuler</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
