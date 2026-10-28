import { useSQLiteContext } from 'expo-sqlite';
import { act, useEffect ,useState} from 'react'; 
import { View, useColorScheme, Text, Pressable, Modal, StyleSheet} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/colors';

interface ScannedYarnData {
  binId: number;
  image: string;
  yarnName: string;
  brandName: string;
  color: string;
  colorWay: string;
  weight: string;
  fiber: string[];
  skeins: string;
}

interface Row{
  id: number;
  binId: number;
  image: any;
  yarnName: string;
  brandName: string;
  color: string;
  colorWay: string;
  weight: number;
  fiber: string;
  skeins: number;
};

interface EditYarnProps {
    id: number;
    modalVisible: boolean;
    setModalVisible: (value: boolean | ((prevState: boolean) => boolean)) => void;
    onYarnDeleted: ()=> void;
}
export default function EditYarn({id, modalVisible, setModalVisible, onYarnDeleted} : EditYarnProps){
 const systemTheme =useColorScheme();
  const theme = systemTheme === "dark"? "dark": 'light';
   const activeColors = colors[theme];
   
  //state mgmt for selected item
const [currentItem, setCurrentItem]= useState<ScannedYarnData>()
    // connect to router
const router =useRouter();

    //connect to db
 const db = useSQLiteContext();

   //load yarn table
     const loadYarnList = async()=>{
    try{
      //select only unique values from bin table
            const results = await db.getFirstAsync<Row>(`SELECT * FROM master
                WHERE id = ${id}`);
                console.log("MASTER render in edit bins: ", results)
               if(!results){
                return
               }
               // conver fiber json string back to arr
                   let fiber: string[] = [];
    
      fiber = results.fiber ? JSON.parse(results.fiber) : [];
    

                const resultData ={
                      "binId":results.binId,
          "image": results.image , 
      "yarnName": results.yarnName, 
  "brandName": results.brandName, 
  "color": results.color,
  "colorWay" : results.colorWay,
  "weight": String(results.weight), 
  "fiber": fiber, 
  'skeins': String(results.skeins ?? ''),
                }
           setCurrentItem(resultData)
        }catch(e){
            console.log("error loading bin data", e)

 }

   };

   useEffect(()=>{
    
        loadYarnList();
    }, [])



async function deleteBins (){

    try{
       const yResult = await db.runAsync(`DELETE from master WHERE id = ${id}`)
       //set state eof current item
       setModalVisible(false);
       onYarnDeleted(); // reload the yarn list
console.log("bin deleted")
    }catch(e){
        console.log("error deleting bins: ,", e)
    }
}

function edit(){

//show the yarn form with the data of this item in it
router.push({
    pathname: `/(tabs)/addYarn`,
    params: {scannedYarn: JSON.stringify(currentItem), editId : id}
})
setModalVisible(false);
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
<View style={styles.menu}>

</View>
        <Pressable style={({ pressed }) => [styles.pill, pressed && [styles.pillPressed,{ backgroundColor: activeColors.pressed}]]} onPress={deleteBins}>
            <Text style={styles.pillText}>Delete</Text>
        </Pressable>
         <Pressable style={({ pressed }) => [styles.pill, pressed && [styles.pillPressed,{ backgroundColor: activeColors.pressed}]]} onPress={edit}>
            <Text style={styles.pillText}>Edit</Text>
        </Pressable>
         <Pressable style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}  onPress={closeModal}>
            <Text style={styles.pillText}>Cancel</Text>
           
        </Pressable>
        </View>
    </Modal>

    </SafeAreaView>
   
</SafeAreaProvider>
 );

}

const OUTLINE = '#000000';
const BG = '#FFFFFF';

const FONT_BOLD = 'Comfortaa_700Bold';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  menu: {
    width: '70%',
    maxWidth: 280,
    gap: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: BG,
    borderWidth: 3,
    borderColor: OUTLINE,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  pillPressed: {
   
  },
  pillText: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: "#222222"
  },
});
