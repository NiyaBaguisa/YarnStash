import { View, Text, Image, Pressable, Modal, StyleSheet } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
interface QRGeneratorProps {
    binId?: number // link to bin page
}

export default function QRGenerator({binId}: QRGeneratorProps){
    //is the qrcode modal showing?
const [visible, setVisible] = useState(false);

//if the bin has been deleted
if(binId === undefined){
    return null;
}
    //generate code
    function generate(){
        setVisible(true)
    }
   
    return(
        <SafeAreaView>
<Pressable onPress={generate}>
 <Image
          style={styles.icon}
          source={require('../../../assets/images/icons/qr-icon.png')}/>
        </Pressable>
         <Modal visible={visible}
         onRequestClose={()=>setVisible(false)}>
                <View>
                    <QRCode
value={`${binId}`}
size={200}
color="black"
backgroundColor="white"/>
            

                </View>

      </Modal>
        </SafeAreaView>
        
    );

}

const styles = StyleSheet.create({
    icon: {
    
  },})