import { View, FlatList, Pressable, Text } from 'react-native';
import {useState, useEffect} from 'react';
import YarnThumbnail from "@/components/YarnThumbnail";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from 'react-native-safe-area-context';
import YarnDetails from './YarnDetails';
import EmptyData from './Splash/EmptyData';

// type for yarn object
interface Yarn{
    id: number;
    binId: number;
    image: string
  yarnName: string;
  brandName: string;
 color: string;
 colorWay: string;
 weight: string;
  fiber: string;
 skeins: number;
 
}

//Bin type
interface Bin{
    id: number,
    title: string,
}
//props for BinExpandedView

interface ExpandedViewProps{
    pressedBin?: Bin
    setPressedBin: (pressed: Bin | undefined)=> void,
    isBinSelected: boolean,
    setIsBinSelected: (isSelected: boolean) => void
}

export default function BinExpandedView({pressedBin, setPressedBin, isBinSelected, setIsBinSelected }: ExpandedViewProps) {
//conditional rendering , false for list view, true for yarn detailed view
const [isYarnSelected , setIsYarnSelected] = useState<boolean>(false);
//data for selected yarn held in this state
const [selectedYarn, setSelectedYarn] = useState<Yarn>();
// state for this bin's content
 const [currentBinList, setCurrentBinList] = useState<Yarn[]>([])
 const db =useSQLiteContext();

 const loadList = async()=>{
      try{
            const results = await db.getAllAsync(`SELECT * FROM master
                WHERE binId = ${pressedBin?.id} 
                ORDER BY id DESC `);
            setCurrentBinList(results as Yarn[]);
            console.log(currentBinList)
        }catch(e){
            console.log("error loading data", e)

 }};
   useEffect(()=>{
        loadList();

    }, [])

    function handleBack(){
        setIsBinSelected(false);
        setPressedBin(undefined);
    }
    return(
        <SafeAreaView>
          
           <View>
            {isYarnSelected? <YarnDetails isYarnSelected={isYarnSelected} setIsYarnSelected={setIsYarnSelected} selectedYarn={selectedYarn} setSelectedYarn={setSelectedYarn} /> : 
             <>
             <View>
            <Pressable onPress={handleBack}>
               <Text>Back Button</Text>
            </Pressable>

           </View>
           
             <FlatList
             data={currentBinList}
             ListEmptyComponent={<EmptyData />}
             keyExtractor={(item)=> item.id.toString()}
                     renderItem={({item})=>(
                         <YarnThumbnail item ={item} isYarnSelected={isYarnSelected} setIsYarnSelected={setIsYarnSelected} selectedYarn={selectedYarn} setSelectedYarn={setSelectedYarn} onYarnDeleted={loadList}/>)}/>
</>}
           </View>
            
        </SafeAreaView>
    
        )
       
    
 
}