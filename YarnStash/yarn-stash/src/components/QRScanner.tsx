
import { useColorScheme, View, ScrollView, Modal,Pressable, ActivityIndicator, StyleSheet, Button, Text, Image, Alert, FlatList, ImageSourcePropType } from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import ScannerUI from '@/components/Splash/ScannerUI'
import { colors } from '@/colors';

export default function QRScanner(){
  const systemTheme =useColorScheme();
    const theme = systemTheme === "dark"? "dark": 'light';
     const activeColors = colors[theme];
     
    //Camera states
    const [facing, setFacing] = useState<CameraType>('back');
const [permission, requestPermission] = useCameraPermissions();
// state for showing button or qr scanner
const[visible, setVisible]= useState(false);
    // state for if anything has been scanned
    const [isScanned, setIsScanned] = useState<Boolean>(false);



//router declaration
const router = useRouter();
//Reset everything when the screen comes into focus

useFocusEffect(
  useCallback(() => {
    // Do something when the screen is focused
    
    setIsScanned(false);
    setVisible(false)
    
   
  
    return () => {
      // Do something when the screen is unfocused
     
    };
  }, [])
);



// camera permissions are still loading
    if(!permission){
        return <View/>
    }
    // camera permissions not granted => ask for permission
    if(!permission.granted){
        return(
            <View >
        <Text>We need your permission to show the camera</Text>
        <Pressable style={({ pressed }) => [styles.button, pressed &&[styles.buttonPressed, { backgroundColor: activeColors.pressed}]]} onPress={requestPermission}>
          <Text>Request permission</Text>
        </Pressable>
      </View>
        );
    }


// Alert that a barcode has been scanned
    function handleScan({type, data}: {type : string; data: string}){
      if (isScanned){
        return;
      }  
      setIsScanned(true);
        setVisible(false);
         router.push({
        pathname: '/(tabs)/bins',
        params: {qrBinPath: data}
    })
        console.log(`Bar code with type ${type} and data ${data} has been scanned!`)
        //(`Bar code with type ${type} and data ${data} has been scanned!`);

    }




    return(
        <>
         <Pressable onPress={()=> {setIsScanned(false); setVisible(true)}}>
        <Image
        style={styles.icon}
          source={require('../../assets/images/icons/dark-qr-scan.png')}/>
    </Pressable>
    <Modal visible={visible}
    onRequestClose={()=>setVisible(false)}>
         <SafeAreaView style= {styles.container}>
            <CameraView
            style={StyleSheet.absoluteFill} 
            facing ={facing} 
            barcodeScannerSettings={{barcodeTypes:['qr']}}
            onBarcodeScanned={isScanned? undefined: handleScan}/>
           <ScannerUI title="QR Code"/>
         
          <Pressable onPress={() => setVisible(false)} style={{ position: 'absolute', top: 60, left: 20 }}>
            <Text style={{ color: activeColors.buttonText }}>Close</Text>
          </Pressable>
        </SafeAreaView>

    </Modal>
        </>
       
       
    )

}
const BUTTON = '#000000';

const FONT_BOLD = 'Comfortaa_700Bold';

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
 
  icon : {
width:30,
height: 30,
borderRadius:8,
backgroundColor: '#ffffff',
  },
   button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
    backgroundColor: BUTTON,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonPressed: {

  },
 
});