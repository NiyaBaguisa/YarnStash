import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import {useState, useEffect} from 'react';
import MasterList from "@/MasterList";

export default function Index() {



  
return (
    <View style={styles.container}>
      <MasterList/>
    
    
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


