import { View, FlatList } from 'react-native';
import {useState, useEffect} from 'react';
import BinThumbnail from "./BinThumbnail";
import { useSQLiteContext } from 'expo-sqlite';


export default function BinsGridView(){
    //use state for list of bins
    const [binsList, setBinsList] = useState([]);

//connect to db
const db =useSQLiteContext();
//load in bin names from bin table
const loadBinList = async ()=>{
  try{
    const results = await db.getAllAsync(`SELECT title FROM bins 
       ORDER BY id DESC`)
      setBinsList(results as []);
       console.log(results)

  }catch(e){
    console.log("error loading list of bins data", e)
  }
}

useEffect(()=>{
  loadBinList();
},[])


//map bins as Bin thumbnails
    return (
      <FlatList
      data={binsList}
      renderItem= {({item}) => <BinThumbnail title ={item}/>}
      
      />
       
    
    )

};