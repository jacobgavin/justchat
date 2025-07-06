import { PropsWithChildren } from "react";
import { Text, Pressable, PressableProps, StyleSheet } from "react-native";
import { BORDER_RADIUS, PADDING } from "../../theme/variables";

type Props = Omit<PressableProps, "style" | "accessible">;
export default function Button(props: PropsWithChildren<Props>) {
  return (
    <Pressable {...props} style={styles.root} accessible>
      <Text>Send</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    padding: PADDING,
    borderRadius: BORDER_RADIUS,
    backgroundColor: "pink",
  },
});
