import { Text, View, ScrollView, StyleSheet } from "react-native";
import YarnThumbnail from "./YarnThumbnail";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

interface Yarn{
  id: number;
  bin: string;
  image: any;
  yarnName: string;
  brandName: string;
  color: string;
  weight: number;
  fiber: string;
  skeins: number;
 
};
// BinThumbnail props: bin title and yarn items arr
interface binThumbnailProps{
  title: string;

}
// takes in an array of yarns and a label for the bin
export default function BinThumbnail({title }: binThumbnailProps) {

  //state for the list of yarn items
  const [items, setItems] = useState <Yarn []>([]);
//connect to db

const db =useSQLiteContext();
// load in the list of yarn that have this bin value from the master list
const loadYarnList = async ()=>{
  try{
    const results = await db.getAllAsync(`SELECT * FROM master 
       WHERE bin = ${title}
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


  // show the first four yarn thumbnails in a flex grid
    return (
    <View style={styles.container}>
      <Text>{title}</Text>
      <View style={styles.gridContainer}>
        {items[0]&&  <YarnThumbnail {... items[0]}/>  }
        {items[1]&&  <YarnThumbnail {... items[1]}/>  }
        {items[2]&&  <YarnThumbnail {... items[2]}/>  }
        {items[3]&&  <YarnThumbnail {... items[3]}/>  }
        
    

      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
 container:{
  width:'95%',
  padding: 5,
  backgroundColor: '#AECBEB',
 
 
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