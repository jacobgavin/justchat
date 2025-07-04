import {
  Text,
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { BORDER_RADIUS, PADDING } from "../theme/variables";
import { SafeAreaView } from "react-native-safe-area-context";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { messageCollection } from "../firebase/messageCollection";
import ChatList from "../components/ChatList";

export default function ChatScreen() {
  const { name } = useLocalSearchParams();

  if (typeof name !== "string") {
    throw new Error("URL param name must be a string");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Header />

            <ChatList name={name} />

            <Footer name={name} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Footer({ name }: { name: string }) {
  const [message, setMessage] = useState("");

  const createMessage = useMutation({
    mutationKey: ["messages"],
    mutationFn: postMessage,
  });

  function updateMessage(message: string) {
    setMessage(message);
  }

  async function submit() {
    if (typeof name !== "string") {
      throw new Error('Expected search param "name" to be a string');
    }
    if (message.trim() === "") {
      return;
    }
    await createMessage.mutateAsync({ message, username: name });
    setMessage("");
  }

  return (
    <View style={styles.footer}>
      <TextInput
        placeholder="Message..."
        value={message}
        multiline
        style={styles.messageInput}
        onChangeText={updateMessage}
        onSubmitEditing={submit}
      />
      <Pressable onPress={submit} style={styles.button}>
        <View>
          <Text>Send</Text>
        </View>
      </Pressable>
    </View>
  );
}

type MessageData = {
  message: string;
  username: string;
};
async function postMessage(data: MessageData) {
  const doc = await addDoc(messageCollection, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return doc;
}

function Header() {
  return (
    <View style={styles.header}>
      <Text>Chat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "red",
  },
  safeArea: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "pink",
  },
  inner: {
    flex: 1,
  },
  header: {
    padding: PADDING,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  footer: {
    padding: PADDING,
    flexDirection: "row",
    gap: PADDING,
    borderTopWidth: 1,
    borderTopColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  messageInput: {
    borderColor: "#000",
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    flex: 1,
  },
  button: {
    justifyContent: "center",
    padding: PADDING,
  },
});
