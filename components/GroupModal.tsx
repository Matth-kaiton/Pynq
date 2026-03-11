import { createGroup, joinGroup } from "@/servicies/db_queries";
import { styles } from "@/style/style";
import { JSX, useState } from "react";
import { Modal, Pressable, TextInput, View } from "react-native";
import { ThemedText } from "@/components/themed-text";

function formCreateGroup(
  groupName: string,
  setGroupName: (text: string) => void,
  groupDescription: string,
  setGroupDescription: (text: string) => void,
  setCreatingGroup: (creating: boolean) => void,
) {
  return (
    <View>
      <TextInput
        placeholder="Nom du groupe"
        value={groupName}
        onChangeText={setGroupName}
      />

      <TextInput
        placeholder="Description"
        value={groupDescription}
        onChangeText={setGroupDescription}
      />

      <Pressable
        style={styles.button}
        onPress={() => createGroup(groupName, groupDescription)}
      >
        <ThemedText>Créer</ThemedText>
      </Pressable>

      <Pressable style={styles.button} onPress={() => setCreatingGroup(false)}>
        <ThemedText>Rejoindre un groupe</ThemedText>
      </Pressable>
    </View>
  );
}

function formJoinGroup(
  inviteId: string,
  setInviteId: (text: string) => void,
  setCreatingGroup: (creating: boolean) => void,
) {
  return (
    <View>
      <TextInput
        placeholder="Invite ID"
        value={inviteId}
        onChangeText={setInviteId}
      />
      <Pressable style={styles.button} onPress={() => joinGroup(inviteId)}>
        <ThemedText>Rejoindre</ThemedText>
      </Pressable>

      <Pressable style={styles.button} onPress={() => setCreatingGroup(true)}>
        <ThemedText>Créer un groupe</ThemedText>
      </Pressable>
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
    );
  } else {
    form = formJoinGroup(inviteId, setInviteId, setCreatingGroup);
  }

  return (
    <View>
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <ThemedText>Rejoindre ou créer un groupe</ThemedText>
      </Pressable>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {form}
      </Modal>
    </View>
  );
}
