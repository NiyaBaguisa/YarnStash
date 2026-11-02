import { View, Text, Image, Pressable,useColorScheme, Modal, StyleSheet } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/colors";

interface QRGeneratorProps {
    binId?: number // link to bin page
}

export default function QRGenerator({binId}: QRGeneratorProps){
   const systemTheme =useColorScheme();
    const theme = systemTheme === "dark"? "dark": 'light';
     const activeColors = colors[theme];
       
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
<Pressable style={styles.iconContainer} onPress={generate}>
 <Image
          style={styles.icon}
          source={require('../../assets/images/icons/qr-icon.png')}/>
        </Pressable>
         <Modal visible={visible}
         transparent
         animationType="fade"
         onRequestClose={()=>setVisible(false)}>
                <View style={styles.overlay}>
                    <View style={[styles.card, { borderColor: activeColors.outline,}]}>
                        
                        <QRCode
value={`${binId}`}
size={200}
color="black"
backgroundColor="white"/>

            <Pressable
        onPress={() => setVisible(false)}
        style={({ pressed }) => [styles.button,{  backgroundColor: activeColors.text}, pressed && [styles.buttonPressed,{  backgroundColor: activeColors.pressed}]]}>
        <Text style={[styles.buttonText,{color: activeColors.buttonText}]}>Close</Text>
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
height: 30,
backgroundColor: '#ffffff',
borderRadius: 8,
  },
overlay: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.45)",
},
 iconContainer: {
    borderRadius: 8,
    backgroundColor: "white",
    padding: 4,

  },

card: {
  
  borderWidth: 4,
 backgroundColor:'#ffffff',
  borderRadius: 24,
  padding: 24,
  alignItems: "center",
},
button: {
  marginTop: 20,

  borderRadius: 8,
  paddingVertical: 10,
  paddingHorizontal: 28,
},
buttonPressed: {
 
},
buttonText: {
  
  fontSize: 15,
  fontFamily: FONT_BOLD,
},})