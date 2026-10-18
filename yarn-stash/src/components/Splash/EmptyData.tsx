import { View, Text, Image, StyleSheet } from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';


export default function EmptyData() {
   

    return(
        <SafeAreaView style ={styles.container}>
          <Text>Nothing to see here!</Text>
          
          <Text>Add a new yarn to your stash using the plus button below!</Text>
        
        </SafeAreaView>
    
        )
       
    
 
}
const styles = StyleSheet.create({
 container:{
    flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
 
 },

  
});