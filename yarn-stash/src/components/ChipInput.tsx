import { useCallback, useState, Dispatch, SetStateAction } from "react";

import { StyleSheet, View, Text, TextInput, Keyboard, Pressable} from "react-native";
//TO DO: ADD CHIP STYLES


interface ChipInputProps {
    chips: string[];
     setChips: (Dispatch<SetStateAction<string[]>>);
     }
export default function ChipInput({chips, setChips}: ChipInputProps){
   
    //value of current chip
    const [chipVal, setChipVal] = useState("");

    function handleNewChip(){
        const value =chipVal.trim().toLowerCase();

        // if there is text in the input and the input isn't already in the chips array, add it to the array
        if (value.length >0 && !chips.includes(value)){
            setChips(prev  => [...prev, value])

        }
        setChipVal('');
        //dismiss keyboard
        Keyboard.dismiss();
       // console.log("current chips:", chips)
    }

function handleDelete(chip: string){
   setChips((prev => prev.filter((c)=> c!== chip)));}

    function chipsDisplay(){
   return chips.map((chip: string) => (
      <Pressable  onPress={() => handleDelete(chip)} style={styles.chip}>
        <Text>{chip}</Text>
        <Text> X</Text>
      </Pressable>
    ));
  }


    return(
        <View>
            <Text>Yarn Fiber Content</Text>
            <TextInput
                        placeholder="Fiber"
                          placeholderTextColor="#999999"
                        onChangeText={setChipVal}
                        value={chipVal}
                        style={styles.input}
                        onSubmitEditing={handleNewChip}
                      />
                      <View>
                        {chipsDisplay()}
                      </View>
        </View>
    )

}

const styles = StyleSheet.create({

  input: {
    backgroundColor: '#F5F5F5',
    color: '#333333',
    height: 50,
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 16,
 
  },
chip:{

}})
