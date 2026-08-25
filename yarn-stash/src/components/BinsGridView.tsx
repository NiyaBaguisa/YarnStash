import { View, FlatList } from 'react-native';
import {useState, useEffect} from 'react';
import BinThumbnail from "./BinThumbnail";



export default function BinsGridView(){
    //use state for list of bins
    const [binsList, setBinsList] = useState([]);



//map bins as Bin thumbnails
    return (
      <FlatList
      data={binsList}
      renderItem= {({item}) => <BinThumbnail title ={item}/>}
      
      />
       
    
    )

};