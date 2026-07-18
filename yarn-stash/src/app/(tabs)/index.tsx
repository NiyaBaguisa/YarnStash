import { Text, View, StyleSheet, Button } from "react-native";
import { Link } from "expo-router";
import {useState, useEffect} from 'react';
import MasterList from "@/MasterList";
import YarnThumbnail from "@/components/YarnThumbnail";

interface Yarn{
  yarnName: string;
  brandName: string;
  color: string;
  weight: number;
  fiber: string;
  skeins: number;
 image: any;
}

export default function Index() {


const dummyYarn: Yarn ={
   yarnName: 'Test Yarn Name',
  brandName: 'Test Yarn Brand Name',
  color: 'red',
  weight: 4,
  fiber: 'Acrylic blend',
  skeins: 3,
 image: '../../../assets/images/yarn-stash-yarn-ball-icon.svg',

}
  
return (
    <View style={styles.container}>
      {/*<MasterList/>*/}
      <Text>User's Stash</Text>
      <Text>XXX Skeins</Text>
      <YarnThumbnail {...dummyYarn}/>
     
    
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'F8F9FB',
    alignItems: "center",
    justifyContent: "center",
  },
 
  
});


