import { useSQLiteContext } from 'expo-sqlite';
import { useEffect ,useState} from 'react'; 
import { View, Text, Pressable, Modal} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';


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
alert('you pressed edit yarn')
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
    onRequestClose={() => setModalVisible(!modalVisible)}>
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', 'gap': 50 }}>

        <Pressable onPress={deleteBins}>
            <Text>Delete</Text>
        </Pressable>
         <Pressable onPress={edit}>
            <Text>Edit</Text>
        </Pressable>
         <Pressable onPress={closeModal}>
            <Text>Cancel</Text>
           
        </Pressable>
        </View>
    </Modal>

    </SafeAreaView>
   
</SafeAreaProvider>
 );

}
