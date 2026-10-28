// this is where the boxes for the yarn is made and then the bins and the horizontal scroll bars will just take in this component
import { Text, View, Image, Pressable, StyleSheet, useColorScheme } from "react-native";
import EditYarn from "./EditYarn";
import { useState, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { colors } from "@/colors";
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
 const systemTheme =useColorScheme();
  const theme = systemTheme === "dark"? "dark": 'light';
   const activeColors = colors[theme];
   
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
        <View style={[styles.thumbnail, {borderColor: activeColors.outline, backgroundColor: activeColors.bg}]}>
          <View style={styles.imageArea}>
              {item.image ? (
            <Image style={styles.image} source={{ uri: item.image }} />
          ) : (
            <Image style={styles.image} source={require('../../assets/images/default-img.png')} />
          )}

          </View>
        
        </View>
        {/*insert weight image here*/}

        <View style={[styles.detailsContainer, { backgroundColor: item.color.toLowerCase().trim() || FALLBACK_COLOR , borderColor: activeColors.outline}]}>
          <View style = {styles.textBlock}>
            <Text style={[styles.text,{ color: activeColors.text}]} >{item.brandName}</Text>
            <Text style={[styles.text, styles.yarnName, {color: activeColors.text}]}>{item.yarnName}</Text>
            <Text style={[styles.text,{ color: activeColors.text}]} >{item.colorWay}</Text>
            <Text style={[styles.text,{ color: activeColors.text}]} >{JSON.parse(item.fiber).join(", ")}</Text>
          </View>
         
         <View style = {styles.counterRow}>
          <Pressable onPress={increment}>
            <Text>+</Text>
          </Pressable>
             <Text style={[styles.skeinCount,{ color: activeColors.text}]}>{currentSkein}</Text>
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


const FALLBACK_COLOR = "#D9D9D9"; // used only if a yarn has no color value
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
    
    borderWidth: BORDER,
   
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
   
  },

});