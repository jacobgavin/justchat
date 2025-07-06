import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export function useIsKeyboardOpen() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const listenOpen = Keyboard.addListener("keyboardDidShow", () => {
      setIsOpen(true);
    });
    const listenClose = Keyboard.addListener("keyboardDidHide", () => {
      setIsOpen(false);
    });

    return () => {
      listenOpen.remove();
    };
  }, []);

  return isOpen;
}
