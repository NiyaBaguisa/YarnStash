import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function EmptyData() {
  const float = useRef(new Animated.Value(0)).current; // yarn ball bob
  const nudge = useRef(new Animated.Value(0)).current; // arrow toward the + button

  useEffect(() => {
    const loop = (value: Animated.Value, distance: number, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: distance,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );

    const ball = loop(float, -10, 1100);
    const arrow = loop(nudge, 8, 650);
    ball.start();
    arrow.start();
    return () => {
      ball.stop();
      arrow.stop();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
        <Image
          source={require('../../../assets/images/default-img.png')}
          style={styles.ball}
          resizeMode="contain"
          accessibilityLabel="Ball of yarn"
        />
    

      <Text style={styles.title}>'Nothing to see here!'</Text>
      <Text style={styles.message}>'Add a new yarn to your stash using the plus button below!'</Text>

      <Animated.Text style={[styles.arrow, { transform: [{ translateY: nudge }] }]}>
        ↓
      </Animated.Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    paddingHorizontal: 40,
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
  arrow: {
    marginTop: 24,
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6FA5',
  },
});