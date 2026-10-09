import { View, } from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';
import BinExpandedView from "@/components/BinExpandedView";
import BinsGridView from '@/components/BinsGridView';


interface Bin{
    id: number;
    title: string;

}
export default function Bins() {
    // keep track of screen state
    // null / falsy = show grid of bin thumbnails
    // truthy show selected bin
    const [isBinSelected, setIsBinSelected] = useState<boolean>(false);
    //state for selected bin
    const [pressedBin, setPressedBin] = useState <Bin>();
    //use state for list of bins
    const [binsList, setBinsList] = useState<Bin[]>([]);
    // screen loading state
    const [isLoading, setIsLoading] = useState(true);
    
    //connect to db
    const db =useSQLiteContext();
    //load in bin names from bin table
    const loadBinList = async ()=>{
      try{
        const results = await db.getAllAsync(`SELECT * FROM bins 
           ORDER BY id DESC`)
          setBinsList(results as Bin[]);
           console.log("the bins table results", results)
           
    
      }catch(e){
        console.log("error loading list of bins data", e)
      }finally{
        setIsLoading(false);
      }
    }
    // things that run once on when screen is focused /unfocused
      useFocusEffect(
  useCallback(() => {
     loadBinList();
     console.log("use effect results for binslist state:", binsList)
     console.log("pressed Bin state: " , pressedBin) //making sure this is falsy on mount
      
  }, [])
);
//things that run on every render
    useEffect(()=>{
      handleLiftedData();
    })
    //callback function to handle state passed up from grandchild: binThumbnail
    function handleLiftedData (){
      // update state for pressed bool
      
      if(pressedBin != undefined){
        setIsBinSelected(true);

      }
  

    }

//TO DO: bins expanded view should take in a prop of the title of the selected bin
    return(
        <SafeAreaView>
           {isBinSelected? <BinExpandedView pressedBin={pressedBin} setPressedBin={setPressedBin} isBinSelected={isBinSelected} setIsBinSelected={setIsBinSelected}/>: <BinsGridView data={binsList} pressedBin={pressedBin} setPressedBin={setPressedBin} onBinDeleted={loadBinList}/>} 
        
        </SafeAreaView>
    
        )
       
    
 
}