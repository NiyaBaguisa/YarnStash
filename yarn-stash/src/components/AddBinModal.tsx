import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { View, Alert, Modal, TouchableOpacity, Text, StyleSheet, Pressable, TextInput} from 'react-native';
import { useState, useEffect } from 'react';


//props that the AddBiModal takes in
interface addBinModalProps {
    isModalVisible: boolean;
    setIsModalVisible: (visible:boolean)=> void;
    binName: string;
    setBinName: (name:string) => void;
}

export default function AddBinModal({
    isModalVisible,
    setIsModalVisible,
    binName,
    setBinName
}: addBinModalProps){

const db= useSQLiteContext();

// add a new bin to the database of bins
const handleAdd = async() =>{
    //if the user inputs nothing tell them to input something
    if(!binName.trim()){
        Alert.alert('Bin name required')
        return;
    }
 
  try{
    await db.runAsync('INSERT INTO bins (title) VALUES(?)', 
        [binName] )
        //reset new bin name state
        setBinName('');
        //close the modal
        setIsModalVisible(false);

  }catch(e){
    console.log('error logging new bin into database', e)
  }

  console.log('a new bin named: ', binName ,'was added')
 
}


return (
          <Modal
      transparent ={true}
      visible={isModalVisible}
      onRequestClose={()=>{
        Alert.alert('Modal has been closed.')
        setIsModalVisible(false)}}>
          <View>
            <Text>Add A New Bin</Text>
            <TextInput onChangeText ={setBinName}
            value={binName}/>
            <Pressable
            onPress={handleAdd}>
              <Text>Add</Text>
            </Pressable>
          </View>

      </Modal>

)


}


