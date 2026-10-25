import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const LOGO_WIDTH = Math.min(width * 0.8, 440);
const LOGO_ASPECT = 1835 / 919; // logo.png is 1835 x 919

type SplashProps = {
  /** Called with false once the animation is done, so the layout can show the app. */
  setIsLoading: (isLoading: boolean) => void;
};

export default function Splash({ setIsLoading }: SplashProps) {
  const scale = useRef(new Animated.Value(0.2)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1) Zoom in with a little overshoot, fading in as it grows
    const zoomIn = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(scale, {
        toValue: 1.15,
        duration: 550,
        easing: Easing.out(Easing.back(2.2)),
        useNativeDriver: true,
      }),
    ]);

    // 2) Bounce back down to normal size
    const settle = Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 140,
      useNativeDriver: true,
    });

    // 3) Hold a moment, then fade out
    const exit = Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 300,
      delay: 450,
      useNativeDriver: true,
    });

    const animation = Animated.sequence([zoomIn, settle, exit]);
    animation.start(({ finished }) => {
      if (finished) setIsLoading(false);
    });

    // Stop cleanly if the component unmounts early
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <Animated.Image
        source={require('../../../assets/images/logo.png')}
        resizeMode="contain"
        style={{
          width: LOGO_WIDTH,
          height: LOGO_WIDTH / LOGO_ASPECT,
          opacity,
          transform: [{ scale }],
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9F2',
  },
});