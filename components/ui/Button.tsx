import { PropsWithChildren } from "react";
import { Text, Pressable, PressableProps, StyleSheet } from "react-native";
import { BORDER_RADIUS, PADDING } from "../../theme/variables";

type Props = Omit<PressableProps, "style" | "accessible">;
export default function Button({
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <Pressable {...props} role="button" style={styles.root} accessible>
      <Text>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    padding: PADDING * 1.5,
    paddingLeft: PADDING * 2,
    paddingRight: PADDING * 2,
    borderRadius: BORDER_RADIUS,
    backgroundColor: "pink",
  },
});
