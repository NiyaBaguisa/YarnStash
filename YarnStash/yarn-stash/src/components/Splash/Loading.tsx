import React, { useEffect, useRef } from 'react';
import { Animated, useColorScheme, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
 import { colors } from '@/colors';
const DOT_COLORS = ['#00A0D6', '#6A4028', '#FC8DA1'];
// When each dot pops in, as a fraction of the loop (0 → 1)
const DOT_STARTS = [0.05, 0.22, 0.39];
 
export default function Loading() {
    const systemTheme =useColorScheme();
    const theme = systemTheme === "dark"? "dark": 'light';
     const activeColors = colors[theme];
     
  const spin = useRef(new Animated.Value(0)).current;
  const dots = useRef(new Animated.Value(0)).current;
 
  useEffect(() => {
    // Ball: one slow, steady turn every 6 seconds
    const rotation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
 
    // Dots: one timeline that repeats every 1.8 seconds
    const popping = Animated.loop(
      Animated.timing(dots, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
 
    rotation.start();
    popping.start();
    return () => {
      rotation.stop();
      popping.stop();
    };
  }, []);
 
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
 
  // Each dot: hidden → pops in with a little overshoot → holds → disappears for the next loop
  const dotScale = (start: number) =>
    dots.interpolate({
      inputRange: [0, start, start + 0.08, start + 0.14, 0.88, 0.96, 1],
      outputRange: [0, 0, 1.4, 1, 1, 0, 0],
    });
 
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: activeColors.bg}]}>
      <Animated.Image
        source={require('../../../assets/images/default-img.png')}
        style={[styles.ball, { transform: [{ rotate }] }]}
        resizeMode="contain"
      />
 
      <View style={styles.row}>
        <Text style={[styles.text, {color: activeColors.text}]}>Loading</Text>
        {DOT_STARTS.map((start, i) => (
          <Animated.Text
            key={i}
            style={[styles.dot, { color: DOT_COLORS[i], transform: [{ scale: dotScale(start) }] }]}
          >
            .
          </Animated.Text>
        ))}
      </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  ball: {
    width: 120,
    height: 120,
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 28,
    fontWeight: '700',
   
  },
  dot: {
    fontSize: 28,
    fontWeight: '700',
    width: 8, // fixed width so "Loading" doesn't shift as dots appear
    textAlign: 'center',
  },
});
 

