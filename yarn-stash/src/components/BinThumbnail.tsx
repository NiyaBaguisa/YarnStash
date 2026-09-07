import { Text, View, ScrollView, StyleSheet, Pressable } from "react-native";
import YarnThumbnail from "./YarnThumbnail";
import YarnMiniThumbnail from "./YarnMiniThumbnail";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

interface Yarn{
  id: number;
  bin: string;
  image: any;
  yarnName: string;
  brandName: string;
  color: string;
  weight: string;
  fiber: string;
  skeins: number;
 
};
// BinThumbnail props: bin title, yarn items arr, pressed bin state, 
interface binThumbnailProps{
  id: number,
  title:string,
  pressedBin?: Bin,
  setPressedBin : (pressed:Bin) => void;
  

}

interface Bin{
    id: number,
    title: string
}
// takes in an array of yarns and a label for the bin
export default function BinThumbnail({id, title, pressedBin, setPressedBin}: binThumbnailProps) {

  //state for the list of yarn items
  const [items, setItems] = useState <Yarn []>([]);
//connect to db

const db =useSQLiteContext();
// load in the list of yarn that have this bin value from the master list
const loadYarnList = async ()=>{
  try{
    const results = await db.getAllAsync(`SELECT * FROM master 
       WHERE binId = ${id}
       ORDER BY id DESC`)
      setItems(results as Yarn[]);
       console.log(results)

  }catch(e){
    console.log("error loading yarn data for", title, "bin: ", e)
  }
}

useEffect(()=>{
  loadYarnList();
},[])

function handlePress(){
// lift state to bins grid view
setPressedBin({id: id, title: title});
  console.log(id, title);
  
}
  // show the first four yarn thumbnails in a flex grid
    return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>{title}</Text>
      <Text style= {styles.skeins}>number Skeins</Text>
      <View style={styles.gridContainer}>
        {items[0]&&  <YarnMiniThumbnail {... items[0]}/>  }
         {items[1]&&  <YarnMiniThumbnail {... items[1]}/>  }
          {items[2]&&  <YarnMiniThumbnail {... items[2]}/>  }
           
        
        
    

      </View>
     
    </Pressable>
  );
}

const styles = StyleSheet.create({
 container:{
  width:'95%',
  padding: 10,
  backgroundColor: '#FC8DA1',
 margin: 10,
 borderRadius: 15,
 
 },
 title:{
  fontSize: 24,
  
 },
 skeins:{
  fontSize: 16,

 },

 gridContainer:{
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
     alignItems: 'center',
     justifyContent: 'center'
 },


  Text:{
    color:'#131c26'
  }
  
});