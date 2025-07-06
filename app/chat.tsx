import {
  Text,
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { BORDER_RADIUS, PADDING } from "../theme/variables";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import ChatList from "../features/ChatList";
import { useIsKeyboardOpen } from "../hooks/useIsKeyboardOpen";
import { defaultTo } from "lodash";
import Button from "@ui/Button";
import { createMessage } from "../api/messages";

export default function ChatScreen() {
  const { name } = useLocalSearchParams();

  if (typeof name !== "string") {
    throw new Error("URL param name must be a string");
  }

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.flex}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
          contentContainerStyle={styles.flex}
        >
          <View style={styles.flex}>
            <Header />

            <ChatList name={name} />

            <Footer name={name} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Text>Chat</Text>
    </View>
  );
}

function Footer({ name }: { name: string }) {
  const [message, setMessage] = useState("");
  const isKeyboardOpen = useIsKeyboardOpen();

  const { mutateAsync } = useMutation({
    mutationKey: ["messages"],
    mutationFn: createMessage,
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
    await mutateAsync({ message, username: name });
    setMessage("");
  }

  return (
    <View style={[styles.footer, isKeyboardOpen && styles.footerKeyboardOpen]}>
      <TextInput
        placeholder="Message..."
        value={message}
        multiline
        style={styles.messageInput}
        onChangeText={updateMessage}
        onSubmitEditing={submit}
      />
      <Button onPress={submit}>Send</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    padding: PADDING,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  footer: {
    padding: PADDING,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: PADDING,
    borderTopWidth: 1,
    borderTopColor: "black",
  },
  footerKeyboardOpen: {
    paddingBottom: defaultTo(StatusBar.currentHeight, 0) + PADDING,
  },
  messageInput: {
    borderColor: "#000",
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    flex: 1,
  },
});
