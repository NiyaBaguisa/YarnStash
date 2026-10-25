// this is where the boxes for the yarn is made and then the bins and the horizontal scroll bars will just take in this component
import { Text, View, Image, Pressable, StyleSheet } from "react-native";
import EditYarn from "./EditYarn";
import { useState, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";

// type for yarn object
interface Yarn {
  id: number;
  binId: number;
  image: string
  yarnName: string;
  brandName: string;
  color: string;
  colorWay: string;
  weight: string;
  fiber: string;
  skeins: number;

}
interface SkeinObject {
  skeins: number
}


interface YarnThumbnailProps {
  item: Yarn,
  isYarnSelected: boolean,
  setIsYarnSelected: (value: boolean) => void,
  selectedYarn?: Yarn,
  setSelectedYarn: (item: Yarn | undefined) => void,
  onYarnDeleted: () => void;


}

export default function YarnThumbnail({ item, isYarnSelected, setIsYarnSelected, selectedYarn, setSelectedYarn, onYarnDeleted }: YarnThumbnailProps) {

  const weights: string[] = ['Lace', 'Super Fine', 'Fine', 'Light', 'Medium', 'Bulky', 'Super Bulky', 'Jumbo'];

  //modal visibilty state
  const [modalVisible, setModalVisible] = useState(false);

 const [currentSkein, setCurrentSkein] = useState(item.skeins);

  //handle long press to bring up editing /deleteing modal
  function handleLongPress() {
    setModalVisible(true);
    console.log('you long pressed the yarn thumbnail', modalVisible);
  }
 const db =useSQLiteContext();

 //get skein amount for this yarn
 async function currentAmount(){
  try{
             const resultSkein: SkeinObject[] = await db.getAllAsync(`SELECT skeins FROM master
                 WHERE id = ${item.id}`);
             
              await db.getAllAsync(`UPDATE master
              SET skeins = ${currentSkein} WHERE id=${item.id} `)
            
         }catch(e){
             console.log("error loading yarnid: ", item.id,"'s data", e)
 
  }
 }
useEffect(()=>{
// 
currentAmount()
console.log(currentSkein)
            
},[increment, decrement])
  //handle increment
  function increment(){
    console.log('button pressed')
setCurrentSkein(prev=> prev +1);
  }

  //handle decrement
  function decrement(){
    console.log('button pressed')
setCurrentSkein(prev=> prev -1);
  }

  return (
    <Pressable onLongPress={handleLongPress}>


      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnail}>
          <View style={styles.imageArea}>
              {item.image ? (
            <Image style={styles.image} source={{ uri: item.image }} />
          ) : (
            <Image style={styles.image} source={require('../../assets/images/default-img.png')} />
          )}

          </View>
        
        </View>
        {/*insert weight image here*/}

        <View style={[styles.detailsContainer, { backgroundColor: item.color.toLowerCase().trim() || FALLBACK_COLOR }]}>
          <View style = {styles.textBlock}>
            <Text style={styles.text} >{item.brandName}</Text>
            <Text style={[styles.text, styles.yarnName]}>{item.yarnName}</Text>
            <Text style={styles.text} >{item.colorWay}</Text>
            <Text style={styles.text} >{JSON.parse(item.fiber).join(", ")}</Text>
          </View>
         
         <View style = {styles.counterRow}>
          <Pressable onPress={increment}>
            <Text>+</Text>
          </Pressable>
             <Text style={styles.skeinCount}>{currentSkein}</Text>
             <Pressable onPress={decrement}>
            <Text>-</Text>
          </Pressable>

         </View>
      
        </View>
      
        
      </View>
      <EditYarn id={item.id} modalVisible={modalVisible} setModalVisible={setModalVisible} onYarnDeleted={onYarnDeleted} />
    </Pressable>

  )
}

const INK = "#222222";
const OUTLINE = "#000000";
const FALLBACK_COLOR = "#D9D9D9"; // used only if a yarn has no color value
const WHITE = "#FFFFFF"; // white text will be based on color
const BORDER = 4;
const RADIUS = 20;
const FONT_REGULAR = "Comfortaa_400Regular";
const FONT_BOLD = "Comfortaa_700Bold";
const styles = StyleSheet.create({
  thumbnailContainer: {
   width: 320,
    height: 150,
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 10,
  },
  thumbnail: {
       flex: 1,
    backgroundColor: WHITE,
    borderWidth: BORDER,
    borderColor: OUTLINE,
    borderRadius: RADIUS,
    overflow: "hidden",
    padding: 10,
  },
  detailsContainer: {
   position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "60%",
    borderWidth: BORDER,
    borderColor: OUTLINE,
    borderRadius: RADIUS,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
   imageArea: {
    width: "38%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // keeps the whole skein visible inside the white panel
  },
 
 textBlock: {
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    lineHeight: 19,
    fontFamily: FONT_REGULAR,
    color: INK,
    textAlign: "center",
  },
  yarnName: {
    fontFamily: FONT_BOLD,
  },

   counterRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  skeinCount: {
    fontSize: 22,
    fontFamily: FONT_BOLD,
    color: INK,
  },

});