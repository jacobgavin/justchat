import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <ChooseDisplayName />
    </View>
  );
}

function ChooseDisplayName() {
  const [name, setName] = useState("");
  const [error, setError] = useState<null | string>(null);

  function updateName(name: string) {
    setName(name);
    setError(null);
  }

  function startChat() {
    if (name === "") {
      setError("Name is required");
      return;
    }
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

const BORDER_RADIUS = 8;
const PADDING = 8;

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
