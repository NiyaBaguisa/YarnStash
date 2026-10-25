import {Modal, View, Text, TouchableOpacity, Animated, StyleSheet,} from 'react-native';
import { useRouter } from 'expo-router';


//show the add yarn and add bin menus
 export default function AddMenu({visible, onClose}:{visible: boolean; onClose: ()=> void}){
console.log('menu rendered, visible=', visible)
    const router = useRouter();

    return (
 
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose} // needed for Android back button
      >
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose} // tap outside to close
        >
          <TouchableOpacity
            style={styles.circle}
            onPress={() => {
              onClose();
              router.push('../addYarn');
            }}
          >
            <Text>Y</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
}

const styles = StyleSheet.create({

    menu:{
          backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 100,
    borderRadius: 16,
    padding: 8,

    },
    addMenuButton:{
        padding: 16

    },
      circle:{
    backgroundColor: '#f52d56',
     width: 60,
     height: 60,
     borderRadius: 50,
     justifyContent: 'center',
     alignItems: 'center',
  },
  backdrop:{
      position: 'absolute',
      top:0,
      left: 0,
        right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  
  }
 

    
  })