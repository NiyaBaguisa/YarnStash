import {Modal, Button, View, Text, TouchableOpacity, Animated, StyleSheet, FlatList,} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';// define what a search result yarn looks like

type RavelrySearchResult = {
  id: number;
  name: string;
  gauge_divisor?: number;
  [key: string]: any; // allow other fields from the API without listing every one
};

type TopMatchesProps = {
  visible: boolean;
  onClose: () => void;
  matches: RavelrySearchResult[];
};
export default function ConfirmModal({ visible, onClose, matches }: TopMatchesProps){
   


    return(
        <SafeAreaView style={styles.container}>
            <Modal visible={visible} 
            animationType='slide'
            onRequestClose={onClose}></Modal>
<View>
    <Text>This is where the top match lives.</Text>
    <Button title="Close" onPress={onClose}/>
  
</View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});