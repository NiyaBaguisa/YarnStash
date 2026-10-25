import { SafeAreaView } from "react-native-safe-area-context";

import {useCallback} from 'react';
import {Alert, Pressable, Text, Linking, StyleSheet, } from 'react-native';



type OpenURLButtonProps = {
  url: string;
  children: string;
};

export default function URLButton({url, children}: OpenURLButtonProps) {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Cannot open this URL at this time: ${url}`);
    }
  }, [url]);

  return <Pressable
          onPress={handlePress}
          style={({ pressed }) => [styles.button, styles.submitButton, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>{children}</Text>
        </Pressable>;
};

const BG = '#FFFFFF';
const FIELD_BORDER = '#D0D0D0';
const BUTTON = '#000000';
const BUTTON_PRESSED = '#5B9FD3';
const FONT_BOLD = 'Comfortaa_700Bold';
const styles = StyleSheet.create({
 button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
    backgroundColor: BUTTON,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonPressed: {
    backgroundColor: BUTTON_PRESSED,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: FONT_BOLD,
  },
  submitButton: {
    minWidth: 180,
    marginTop: 12,
  },})