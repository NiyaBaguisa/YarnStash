import { SafeAreaView } from "react-native-safe-area-context";
import URLButton from "./URLButton";
import {Text, StyleSheet, Image, View} from 'react-native';

const policyURL = 'https://google.com';

const contactURL = '';

export default function Settings(){
  return (
    <View style={styles.container}>
        <Text>Light and Dark Mode Toggle</Text>
        <Image
                  source={require('../../../assets/images/default-img.png')}
                  style={styles.ball}
                  resizeMode="contain"
                  accessibilityLabel="Ball of yarn"
                />
   
        <Text style={styles.title}>App Version</Text>
        <Text style={styles.message}>1.0</Text>
      <URLButton url={policyURL}>Terms and Privacy Policy</URLButton>
      <URLButton url={contactURL}>Contact Us</URLButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    width: 96,
    height: 96,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#6A4028',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    lineHeight: 23,
    color: '#8A6A58',
    textAlign: 'center',
    maxWidth: 280,
  },
});

