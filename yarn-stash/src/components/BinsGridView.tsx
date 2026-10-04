import { View, FlatList, StyleSheet, Text, Pressable } from 'react-native';
import {useState, useEffect} from 'react';
import BinThumbnail from "./BinThumbnail";
import { SafeAreaView } from 'react-native-safe-area-context';

//TO DO: Pass pressed bin state to edit bins component

interface Bin{
    id: number,
    title: string
}

interface GridViewProps{
    data: Bin[],
    pressedBin?: Bin,
    setPressedBin: (pressed: Bin) => void;
   
}

export default function BinsGridView({data, pressedBin, setPressedBin} : GridViewProps){




//map bins as Bin thumbnails
    return (
        <SafeAreaView style={styles.container}>
            <Text>Long press to delete a bin</Text>
            <Text style={styles.header}>X Bins</Text>
              <FlatList
      data={data}
      renderItem= {({item}) => <BinThumbnail id={item.id} title={item.title} pressedBin = {pressedBin} setPressedBin={setPressedBin}/>}
      
      />

        </SafeAreaView>
    
       
    
    )

};

const styles = StyleSheet.create({
 container:{
  justifyContent: 'center',
  alignItems: 'center'
 
 },
 header:{
    fontSize: 36
 }
  
});