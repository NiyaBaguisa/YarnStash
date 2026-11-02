import { useCallback, useState, Dispatch, SetStateAction } from "react";
import { StyleSheet, useColorScheme, View, Text, TextInput, Keyboard, Pressable} from "react-native";
import { colors } from "@/colors";

interface ChipInputProps {
    chips: string[];
     setChips: (Dispatch<SetStateAction<string[]>>);
     onBlur?: ()=> void;
     }
export default function ChipInput({chips, setChips, onBlur}: ChipInputProps){
    const systemTheme =useColorScheme();
  const theme = systemTheme === "dark"? "dark": 'light';
   const activeColors = colors[theme];
   
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
      <Pressable  key ={chip} style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
      onPress={() => handleDelete(chip)} >
        <Text style={[styles.chipText, { color: activeColors.text, fontFamily: "Comfortaa-VariableFont_wght" }]}>{chip}</Text>
        <Text style={[styles.chipX, { color: activeColors.text }]}> X</Text>
      </Pressable>
    ));
  }


    return(
        <View>
            <Text style={{color: activeColors.text, fontFamily: "Comfortaa-VariableFont_wght"}}>Yarn Fiber Content</Text>
            <TextInput
                        placeholder="Fiber"
                          placeholderTextColor="#999999"
                        onChangeText={setChipVal}
                        value={chipVal}
                        style={[styles.input,{color: activeColors.text, backgroundColor: activeColors.bg, borderColor: activeColors.outline, fontFamily: "Comfortaa-VariableFont_wght"}]}
                        onSubmitEditing={handleNewChip}
                        onBlur={onBlur}
                      />
                      <View style={styles.chipRow}>
                        {chipsDisplay()}
                      </View>
        </View>
    )

}

const styles = StyleSheet.create({

  input: {
    
    height: 50,
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 16,
 
  },
  chipRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 8,
},
chip: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 50,
  borderWidth: 1,
  borderColor: "rgba(128,128,128,0.35)",
  backgroundColor: "rgba(128,128,128,0.15)",
},
chipPressed: {
  opacity: 0.6,
},
chipText: {
  fontSize: 14,
},
chipX: {
  fontSize: 11,
  fontWeight: "700",
  opacity: 0.6,
},
})
