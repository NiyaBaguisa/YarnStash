import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
//show the add yarn and add bin menus
 export default function AddMenu({visible, onClose}:{visible: boolean; onClose: ()=> void}){

    const router = useRouter();
    return (
        <Modal
        visible={visible}
        onRequestClose={onClose}
        transparent
        animationType="fade">
            <View style={styles.menu}>
                {/*add yarn menu button*/}
            <TouchableOpacity
            style={styles.addMenuButton}
            onPress={() => {onClose();
            router.push('/addYarn')}}>
                <Text>Add Yarn</Text>
        </TouchableOpacity>
            {/*add bin menu button*/}
           

            </View>
            
        </Modal>
    )
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

    }
 

    
  })