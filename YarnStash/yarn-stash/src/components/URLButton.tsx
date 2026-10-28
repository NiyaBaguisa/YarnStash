import { SafeAreaView } from "react-native-safe-area-context";

import {useCallback} from 'react';
import {Alert, useColorScheme, Pressable, Text, Linking, StyleSheet, } from 'react-native';
import { colors } from "@/colors";


type OpenURLButtonProps = {
  url: string;
  children: string;
};

export default function URLButton({url, children}: OpenURLButtonProps) {
   const systemTheme =useColorScheme();
    const theme = systemTheme === "dark"? "dark": 'light';
     const activeColors = colors[theme];
     
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
          style={({ pressed }) => [styles.button,{backgroundColor: activeColors.text}, styles.submitButton, pressed && [styles.buttonPressed, { backgroundColor: activeColors.pressed}]}>
          <Text style={[styles.buttonText, {color: activeColors.buttonText}]}>{children}</Text>
        </Pressable>;
};


const BUTTON_PRESSED = '#5B9FD3';
const FONT_BOLD = 'Comfortaa_700Bold';
const styles = StyleSheet.create({
 button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
    
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonPressed: {
   
  },
  buttonText: {
    
    fontSize: 15,
    fontFamily: FONT_BOLD,
  },
  submitButton: {
    minWidth: 180,
    marginTop: 12,
  },})