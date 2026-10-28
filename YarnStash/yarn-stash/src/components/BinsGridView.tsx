import { useColorScheme, FlatList, StyleSheet, Text, Pressable } from 'react-native';
import {useState, useEffect} from 'react';
import BinThumbnail from "./BinThumbnail";
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyData from './Splash/EmptyData';
import { colors } from '@/colors';
interface Bin{
    id: number,
    title: string
}

interface GridViewProps{
    data: Bin[],
    pressedBin?: Bin,
    setPressedBin: (pressed: Bin) => void;
    onBinDeleted: () => void;
   
}

export default function BinsGridView({data, pressedBin, setPressedBin, onBinDeleted} : GridViewProps){

      const systemTheme =useColorScheme();
      const theme = systemTheme === "dark"? "dark": 'light';
       const activeColors = colors[theme];
      


//map bins as Bin thumbnails
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{color: activeColors.text}}>Long press to delete a bin</Text>
            <Text style={[styles.header, {color: activeColors.text}]}>{data.length} Bins</Text>
              <FlatList
      data={data}
      ListEmptyComponent={<EmptyData />}
      renderItem= {({item}) => <BinThumbnail id={item.id} title={item.title} pressedBin = {pressedBin} setPressedBin={setPressedBin} onBinDeleted={onBinDeleted}/>}
      
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