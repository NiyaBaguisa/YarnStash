import { Text, View, StyleSheet, Image, Button } from "react-native";
import { Link } from "expo-router";
import {useState, useEffect} from 'react';
import MasterList from "@/MasterList";
import YarnThumbnail from "@/components/YarnThumbnail";



export default function Index() {


  
return (
    <View style={styles.container}>
      {/*<MasterList/>*/}
      <Text>User's Stash</Text>
      <Text>XXX Skeins</Text>
      
      
     
    
    
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


