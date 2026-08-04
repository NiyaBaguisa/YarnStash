import { View, FlatList } from 'react-native';
import {useState, useEffect} from 'react';
import YarnThumbnail from "@/components/YarnThumbnail";
import { useSQLiteContext } from "expo-sqlite";

// type for yarn object
interface Yarn{
    id: number;
    bin: string;
    photo: string
  yarnName: string;
  brandName: string;
 color: string;
 weight: number;
  fiber: string;
 skeins: number;
 
}

export default function BinExpandedView() {
// state for this bin's content
 const [currentBinList, setCurrentBinList] = useState<Yarn[]>([])
 const db =useSQLiteContext();

 const loadList = async()=>{
      try{
            const results = await db.getAllAsync(`SELECT * FROM master
                WHERE bin = "Default Bin" 
                ORDER BY id DESC `);
            setCurrentBinList(results as Yarn[]);
            console.log(currentBinList)
        }catch(e){
            console.log("error loading data", e)

 }};
   useEffect(()=>{
        loadList();

    }, [])
    return(
        <View>
           
             <FlatList
             data={currentBinList}
             keyExtractor={(item)=> item.id.toString()}
                     renderItem={({item})=>(
                         <YarnThumbnail{...item}/>)}/>
        </View>
    
        )
       
    
 
}