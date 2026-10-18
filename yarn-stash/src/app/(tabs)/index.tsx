import { Text, View, StyleSheet, Image, Button, FlatList, TextInput, Pressable } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import {useState, useEffect, useCallback} from 'react';
import { useSQLiteContext } from "expo-sqlite";
import YarnThumbnail from "@/components/YarnThumbnail";
import { SafeAreaView } from "react-native-safe-area-context";


interface DBYarn{
  id: number;
  binId: number;
  image: string;
  yarnName: string;
  brandName: string;
  color: string;
  colorWay: string;
  weight: string;
  fiber: string;
  skeins: number;
};

type ColorRow ={
  color: string;
}
type BrandRow ={
  brandName: string;
}
type FiberRow ={
  fibers: string;
}
type WeightRow ={
  weight: string;
}
/*interface FilterChip{
name: string;
active : boolean
}
*/
export default function Index() {
//yarn items data
const [items, setItems] = useState<DBYarn[]>([])
//conditional rendering , false for list view, true for yarn detailed view
const [isYarnSelected , setIsYarnSelected] = useState<boolean>(false);
//data for selected yarn held in this state
const [selectedYarn, setSelectedYarn] = useState<DBYarn>();
// searchbar text
const [text,setText] = useState("");
//conditional rendering , true for list view, false for nothing shown
const [isNothing, setIsNothing] = useState<boolean>(false)
const db = useSQLiteContext();
//filtered items
const[filteredItems, setFilteredItems]= useState<DBYarn[]>([])
// fiber filter
const [fiberFilters, setFiberFilters] = useState<string[]>([])
// color filter
const [colorFilters, setColorFilters] = useState<string[]>([])
//brand filter
const [brandFilters, setBrandFilters] = useState<string[]>([])
//weight filter
const [weightFilters, setWeightFilters] = useState<string[]>([])
//active filters
const [activeFilters, setActiveFilters] = useState<string[]>([]);

//load in yarn database
const loadData = async() =>{
     try{
      //select only unique values from bin table
            const results = await db.getAllAsync(`SELECT * FROM master
                ORDER BY id DESC `);
                setItems( results as DBYarn[])
                console.log("Items Data: ", results)
                //filter data
                const cFilters = await db.getAllAsync<ColorRow>(`SELECT DISTINCT color FROM master`)
          setColorFilters(cFilters.map((row)=> (row.color)))

          const bFilters = await db.getAllAsync<BrandRow>(`SELECT DISTINCT brandName FROM master`)
          setBrandFilters(bFilters.map((row)=> (row.brandName)))

          const wFilters = await db.getAllAsync<WeightRow>(`SELECT DISTINCT weight FROM master`)
          setWeightFilters(wFilters.map((row)=>(row.weight)))

          const fFilters = await db.getAllAsync<FiberRow>(`SELECT DISTINCT fiber FROM master`)
          console.log('fiber col values:', fFilters);
          // convert json string JSON.parse(jsonString);
          // add unique values to an array
          //map the values to chip objects
          //assign the objects to fiber filters

        }catch(e){
            console.log("error loading bin data", e)

 }
}

useFocusEffect(
  useCallback(() => {
    loadData();
  }, [db])
);

// toggle filter TO DO: FIX STATE MANAGEMENT 
function toggleFilter(filter : string){
//filter.active = !filter.active;
setActiveFilters(prev => prev.includes(filter)? prev.filter(name => name !== filter): [...prev, filter])
console.log(filter, ": toggled")

}


// filter chips 
function filterRenderItem(filterList: string[]) {
  return filterList.map(name => {
    const isActive = activeFilters.includes(name)
    return (
      <Pressable
        key={name}
        onPress={() => toggleFilter(name)}
        style={[styles.chip, isActive && styles.chipActive]}>
        <Text>{name}</Text>
      </Pressable>
    )
  })
}

useEffect(()=>{
// set filtered items based on text and if the new items also pass the chip filters
let activeItems :DBYarn[] = [];
//does item include text, yes, show
  const newItems = text ? (items.filter(item => item.yarnName.toLowerCase().includes(text.toLowerCase()) || item.brandName.toLowerCase().includes(text.toLowerCase()) )) : items;
//does item match filter? yes, show
if(activeFilters.length > 0){
  for (const item of newItems){
  const hasMatch = Object.values(item).some(val => activeFilters.includes(val));
  if (hasMatch){
    activeItems.push(item);
  };
  }
  setFilteredItems(activeItems);

}else{
  setFilteredItems(newItems)
}


 
   
  console.log("active filters: ", activeFilters)
},[text, activeFilters, items])

return (
  <SafeAreaView style={styles.container}>
    <View style={styles.container}>
     
      <Text>My Stash</Text>
      <Text>{items.length} Skeins</Text>
      <View>
         <TextInput
      style={styles.input}
      onChangeText={setText}
      value={text}/>
      </View>
      <View>
        {filterRenderItem(colorFilters)}
        {filterRenderItem(brandFilters)}
        {filterRenderItem(weightFilters)}
        
      </View>

      <View style={styles.list}>
        <FlatList
        data ={filteredItems}
        keyExtractor={(item)=> item.id.toString()}
        renderItem={({item}) => <YarnThumbnail item={item} isYarnSelected={isYarnSelected} setIsYarnSelected={setIsYarnSelected} selectedYarn={selectedYarn} setSelectedYarn={setSelectedYarn} onYarnDeleted={loadData}/>}/>
      </View>
    </View>

  </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'F8F9FB',
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    padding: 10,
  },
chip: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderWidth: 1,
  borderRadius: 16,
  margin: 4,
},
chipActive: {
  backgroundColor: '#cfe3ff',
},
 list: {
  height: '50%',
  width: '100%',
  overflow: 'hidden'
 }
  
});


