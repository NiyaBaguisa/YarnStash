import { View, } from 'react-native';
import {useState, useEffect} from 'react';
import { useSQLiteContext } from 'expo-sqlite';
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
    const [selectedBin, setSelectedBin] = useState(false);
    console.log("has a bin been selected?: ", selectedBin)
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
    
    useEffect(()=>{
      loadBinList();
    },[])

//TO DO: bins expanded view should take in a prop of the title of the selected bin
    return(
        <View>
           {/* {selectedBin? <BinExpandedView/>: <BinsGridView/>}*/} 
        
        </View>
    
        )
       
    
 
}