import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
interface UIProps {
    title : string
}

export default function ScannerUI({title}: UIProps) {
const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const size = width - 16 * 2; // square finder
  const gap = (height - size) / 2; // dim space above and below it

  return (
 <View style={styles.overlayContainer} >
     <View
        pointerEvents="none"
        style={{
          flex: 1,
          borderColor: 'rgba(0, 0, 0, 0.35)',
          borderLeftWidth: gap,
          borderRightWidth: gap,
          borderTopWidth: gap,
          borderBottomWidth: gap,
        }}
      >
        <View style={styles.window} />
        </View>
     
      <View style={[styles.header, { top: insets.top + 12 }]}>
        <Text style={styles.title}>Scan Item</Text>
      </View>

 <View style={[styles.hint, { top: gap + size + 16 }]}>
        <Text style={styles.hintText}>Move the finder over a {title}</Text>
      </View>

      </View>
   
  );
}

const styles = StyleSheet.create({
  
  overlayContainer: {
    ...StyleSheet.absoluteFill, 
    justifyContent: 'center',        
    alignItems: 'center',         
  },
  overlayText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background for readability
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },

  window: {
    flex: 1,
    width:300,
    borderWidth: 3,
    borderColor: '#000000',
   
  },
  header: {
    position: 'absolute',
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  hint: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
});

