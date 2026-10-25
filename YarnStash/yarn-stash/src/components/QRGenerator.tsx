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
          source={require('../../assets/images/icons/qr-icon.png')}/>
        </Pressable>
         <Modal visible={visible}
         transparent
         animationType="fade"
         onRequestClose={()=>setVisible(false)}>
                <View style={styles.overlay}>
                    <View style={styles.card}>
                        
                        <QRCode
value={`${binId}`}
size={200}
color="black"
backgroundColor="white"/>

            <Pressable
        onPress={() => setVisible(false)}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonText}>Close</Text>
      </Pressable>


                    </View>
                    
                </View>

      </Modal>
        </SafeAreaView>
        
    );

}
const FONT_BOLD = "Comfortaa_700Bold";
const styles = StyleSheet.create({
      icon : {
width:30,
height: 30
  },
overlay: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.45)",
},
card: {
  backgroundColor: "#FFFFFF",
  borderWidth: 4,
  borderColor: "#000000",
  borderRadius: 24,
  padding: 24,
  alignItems: "center",
},
button: {
  marginTop: 20,
  backgroundColor: "#000000",
  borderRadius: 8,
  paddingVertical: 10,
  paddingHorizontal: 28,
},
buttonPressed: {
  backgroundColor: "#5B9FD3",
},
buttonText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontFamily: FONT_BOLD,
},})