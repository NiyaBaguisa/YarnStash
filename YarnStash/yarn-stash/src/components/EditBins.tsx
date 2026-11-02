import { useSQLiteContext } from 'expo-sqlite';
import { useEffect ,useState} from 'react'; 
import { View, Text, useColorScheme, Pressable, Modal, StyleSheet} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/colors';

interface Bin{
    id: number,
    title: string
}

interface EditBinsProps {
    id: number;
    modalVisible: boolean;
    setModalVisible: (value: boolean | ((prevState: boolean) => boolean)) => void;
    onBinDeleted: ()=> void;
}
export default function EditBins({id, modalVisible, setModalVisible, onBinDeleted} : EditBinsProps){


    //connect to db
 const db = useSQLiteContext();

// state for bins in the grid view
   //load bin table
   const loadBinList = async()=>{
    try{
      //select only unique values from bin table
            const results = await db.getAllAsync(`SELECT * FROM bins
                ORDER BY id DESC `);
                console.log("BINS render in edit bins: ",results)
           
        }catch(e){
            console.log("error loading bin data", e)

 }

   };
   //load yarn table
     const loadYarnList = async()=>{
    try{
      //select only unique values from bin table
            const results = await db.getAllAsync(`SELECT * FROM master
                WHERE binId = ${id}
                ORDER BY id DESC `);
                console.log("MASTER render in edit bins: ", results)
           
        }catch(e){
            console.log("error loading bin data", e)

 }

   };

   useEffect(()=>{
        loadBinList();
        loadYarnList();
    }, [])



async function deleteBins (){

    try{
       const bResult = await db.runAsync(`DELETE FROM bins WHERE id = ${id}`)
       const yResult = await db.runAsync(`DELETE from master WHERE binId = ${id}`)
       setModalVisible(false);
       onBinDeleted(); // reload the bins list
console.log("bin deleted")
    }catch(e){
        console.log("error deleting bins: ,", e)
    }
}

function closeModal(){
    setModalVisible(false)
     console.log("modal closed");
}

 return(
    <SafeAreaProvider>

    
    <SafeAreaView>
         <Modal
    transparent={true}
    visible={modalVisible}
    animationType="fade"
    onRequestClose={() => setModalVisible(!modalVisible)}>
<View style={styles.overlay}>
    <View style={styles.card}>
         <Text style={styles.title}>Are you sure you want to delete the bin?</Text>
          <Text style={styles.subtitle}>This also deletes all the yarn inside it.</Text>
 <View style={styles.buttonRow}>
            <Pressable
              onPress={closeModal}
              style={({ pressed }) => [styles.button, styles.cancelButton, pressed && styles.buttonPressed]}>
                <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
              </Pressable>

              <Pressable
              onPress={deleteBins}
              style={({ pressed }) => [styles.button, styles.confirmButton, pressed && styles.buttonPressed]}>
              <Text style={[styles.buttonText, styles.confirmText]}>Confirm</Text>
            </Pressable>

    </View>
        
       
        </View>
        </View>
    </Modal>

    </SafeAreaView>
   
</SafeAreaProvider>
 );

} const systemTheme =useColorScheme();
  const theme = systemTheme === "dark"? "dark": 'light';
   const activeColors = colors[theme];
   

const INK = '#222222';
const OUTLINE = '#000000';
const BG = '#FFFFFF';
const PRESSED = '#5B9FD3'; // blue pressed state
const FONT_REGULAR = 'Comfortaa_400Regular';
const FONT_BOLD = 'Comfortaa_700Bold';
 
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  card: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: BG,
    borderWidth: 4,
    borderColor: OUTLINE,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "Quicksand-VariableFont_wght",
    color: INK,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Comfortaa-VariableFont_wght",
    color: INK,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: OUTLINE,
    borderRadius: 8,
    paddingVertical: 10,
  },
  cancelButton: {
    backgroundColor: BG,
  },
  confirmButton: {
    backgroundColor: OUTLINE,
  },
  // blue while pressed (same for both buttons)
  buttonPressed: {
    backgroundColor: PRESSED,
  },
  buttonText: {
    fontSize: 15,
     fontFamily: "Comfortaa-VariableFont_wght",
  },
  cancelText: {
    color: INK,
  },
  confirmText: {
    color: '#FFFFFF',
  },
});