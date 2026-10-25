import { TextInput, View, ScrollView, Modal,Pressable, StyleSheet, Button, Text, Image, Alert, FlatList, ImageSourcePropType } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// add the data from the yarn form to the inventory json file
//fetch data from json file and sort them into bins
type Yarn ={
    id: number,
  binId: number
  image: string
  yarnName: string
  brandName: string
  color: string
  colorWay: string
  weight: string
  fiber: string
  skeins: number
  
}

type Bin ={
  id: number;
  title: string;
}

type Weight ={
  id: number,
  name: string,
  image: ImageSourcePropType,
}

interface YarnDetailsProps{
    isYarnSelected: boolean,
    setIsYarnSelected: (value: boolean)=>void,
    selectedYarn?: Yarn,
    setSelectedYarn: (value: Yarn | undefined) => void
}
export default function YarnDetails({isYarnSelected, setIsYarnSelected, selectedYarn, setSelectedYarn}: YarnDetailsProps) {


// data for weight input
const weights: Weight[] =[
   {
    id: 0,
    name: 'Lace',
    image: require('@/assets/images/weightImages/Weight-0-Lace.jpg'),
  },
  {
    id: 1,
    name: 'Super Fine',
    image: require('@/assets/images/weightImages/Weight-1-SuperFine.jpg'),
  },
  {
    id: 2,
    name: 'Fine',
    image: require('@/assets/images/weightImages/Weight-2-Fine.jpg'),
  },
  {
    id: 3,
    name: 'Light',
    image: require('@/assets/images/weightImages/Weight-3-Light.jpg'),
  },
  {
    id: 4,
    name: 'Medium',
    image: require('@/assets/images/weightImages/Weight-4-Medium.jpg'),
  },
  {
    id: 5,
    name: 'Bulky',
    image: require('@/assets/images/weightImages/Weight-5-Bulky.jpg'),
  },
  {
    id: 6,
    name: 'Super Bulky',
    image: require('@/assets/images/weightImages/Weight-6-SuperBulky.jpg'),
  },
  {
    id: 7,
    name: 'Jumbo',
    image: require('@/assets/images/weightImages/Weight-7-Jumbo.jpg'),
  },
];

function handleReturn(){
    setIsYarnSelected(false);
    console.log("back to list view")
    setSelectedYarn(undefined)
   
}
return(
    <SafeAreaView>
        <Pressable onPress={handleReturn}>
            <Text>Bin Name (press to return)</Text>
        </Pressable>
       {selectedYarn?.image ? (
                     <Image style={styles.image} source={{ uri: selectedYarn?.image}} />
                   ) : (
                     <Image style={styles.image} source={require('../../assets/images/default-img.png')} />
                   )}
        <Text>{selectedYarn?.yarnName}</Text>
        <Text>{selectedYarn?.brandName}</Text>
        <Text>{selectedYarn?.color}</Text>
        <Text>{selectedYarn?.colorWay}</Text>
        <Text> {selectedYarn?.weight}</Text>
        <Text>{selectedYarn?.fiber}</Text>
        <Text>{selectedYarn?.skeins}</Text>

    </SafeAreaView>
)}

const styles = StyleSheet.create({
    image:{
        width: '90%',
        aspectRatio: 1,
        resizeMode: 'contain'
    }

})