import { useColorScheme, StyleSheet, Alert,} from 'react-native';
import {useState, useEffect, useCallback, useMemo,} from 'react';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';
import BinExpandedView from "@/components/BinExpandedView";
import BinsGridView from '@/components/BinsGridView';

import { colors } from '@/colors';

interface Bin{
    id: number;
    title: string;

}
export default function Bins() {
    const systemTheme =useColorScheme();
    const theme = systemTheme === "dark"? "dark": 'light';
     const activeColors = colors[theme];
     
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
    },[pressedBin])
    //callback function to handle state passed up from grandchild: binThumbnail
    function handleLiftedData (){
      // update state for pressed bool
      
      if(pressedBin != undefined){
        setIsBinSelected(true);

      }
  

    }
const router = useRouter();
      // parameters inherited from topMatches
      const { qrBinPath } = useLocalSearchParams<{ qrBinPath?: string}>();
    useEffect(()=>{
      if(!qrBinPath){
        return;
      }
      async()=>{

        try{
          const qrBin= await db.getFirstAsync<Bin>(`SELECT * FROM bins WHERE title = ${Number(qrBinPath)}`)
        if (qrBin){
          setPressedBin(qrBin)
        setIsBinSelected(true)
      }else{
Alert.alert('Bin not found', 'This QR code points to a bin that no longer exists.');
        }

        }catch(e){
 console.log('error opening bin from QR', e);
        }finally{
           // clear the param so scanning the same bin again re-triggers this
      router.setParams({ qrBinId: '' });
        }


      }
    },[qrBinPath])
     
    
      
    return(
        <SafeAreaView style={[{backgroundColor: activeColors.bg}, StyleSheet.absoluteFill]}>
           {isBinSelected? <BinExpandedView pressedBin={pressedBin} setPressedBin={setPressedBin} isBinSelected={isBinSelected} setIsBinSelected={setIsBinSelected}/>: <BinsGridView data={binsList} pressedBin={pressedBin} setPressedBin={setPressedBin} onBinDeleted={loadBinList}/>} 
        
        </SafeAreaView>
    
        )
       
    
 
}