import { useSQLiteContext } from 'expo-sqlite';
import { useEffect ,useState} from 'react'; 
import { View, Text, Pressable, Modal} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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

   useEffect(()=>{
        loadBinList();
    }, [])



async function deleteBins (){

    try{
       const result = await db.runAsync(`DELETE FROM bins WHERE id = ${id}`)
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
    onRequestClose={() => setModalVisible(!modalVisible)}>
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', 'gap': 50 }}>
        <Text>Are you sure you want to delete the bin?</Text>
        <Pressable onPress={deleteBins}>
            <Text>Confirm</Text>
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
