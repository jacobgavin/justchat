import { useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { BORDER_RADIUS, PADDING } from "../theme/variables";
import { useNavigate } from "../router/useNavigate";

export default function HomeScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ChooseDisplayName />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

function ChooseDisplayName() {
  const [name, setName] = useState("");
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();

  function updateName(name: string) {
    setName(name.trim());
    setError(null);
  }

  function startChat() {
    if (name === "") {
      setError("Name is required");
      return;
    }
    navigate({ pathname: "/chat", params: { name } });
  }

  return (
    <View style={styles.form}>
      <View style={styles.formContent}>
        <TextInput
          placeholder="Choose your name"
          style={[textInputStyles.textInput, error && textInputStyles.error]}
          value={name}
          onChangeText={updateName}
          onSubmitEditing={() => startChat()}
        />
        <Button title={"Start chat"} onPress={() => startChat()} />
      </View>
      {error && (
        <Text testID="name-error" style={textInputStyles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const textInputStyles = StyleSheet.create({
  textInput: {
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    flexGrow: 1,
  },
  error: {
    borderColor: "red",
    color: "red",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    padding: PADDING,
    width: "100%",
  },
  formContent: {
    display: "flex",
    gap: PADDING,
    width: "100%",
    flexDirection: "row",
  },
});
