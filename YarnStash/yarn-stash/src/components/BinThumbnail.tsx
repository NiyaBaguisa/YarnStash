import { Text, View, useColorScheme, ScrollView, StyleSheet, Pressable } from "react-native";
import YarnThumbnail from "./YarnThumbnail";
import YarnMiniThumbnail from "./YarnMiniThumbnail";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import EditBins from "./EditBins";
import { colors } from "@/colors";

interface Yarn {
  id: number;
  binId: number;
  image: any;
  yarnName: string;
  brandName: string;
  color: string;
  colorWay: string;
  weight: string;
  fiber: string;
  skeins: number;

};
// BinThumbnail props: bin title, yarn items arr, pressed bin state, 
interface binThumbnailProps {
  id: number,
  title: string,
  pressedBin?: Bin,
  setPressedBin: (pressed: Bin) => void;
  onBinDeleted: () => void;


}

interface Bin {
  id: number,
  title: string
}
// takes in an array of yarns and a label for the bin
export default function BinThumbnail({ id, title, pressedBin, setPressedBin, onBinDeleted }: binThumbnailProps) {
  const systemTheme =useColorScheme();
    const theme = systemTheme === "dark"? "dark": 'light';
     const activeColors = colors[theme];
     
  //modal visibilty state
  const [modalVisible, setModalVisible] = useState(false);
  //state for the list of yarn items
  const [items, setItems] = useState<Yarn[]>([]);
  //connect to db

  const db = useSQLiteContext();
  // load in the list of yarn that have this bin value from the master list
  const loadYarnList = async () => {
    try {
      const results = await db.getAllAsync(`SELECT * FROM master 
       WHERE binId = ${id}
       ORDER BY id DESC`)
      setItems(results as Yarn[]);
      console.log(results)

    } catch (e) {
      console.log("error loading yarn data for", title, "bin: ", e)
    }
  }

  useEffect(() => {
    loadYarnList();
  }, [])

  function handlePress() {
    // lift state to bins grid view
    setPressedBin({ id: id, title: title });
    console.log(id, title);

  }

  //on long press show a confirmation modal to delete the bin
  function handleLongPress() {
    setModalVisible(true)
    console.log("you long pressed the button ", modalVisible)
  }
  // show the first four yarn thumbnails in a flex grid
  return (
    <Pressable style={[styles.container, { backgroundColor: activeColors.bg, borderColor: activeColors.outline}]} onPress={handlePress} onLongPress={handleLongPress}>
      <Text style={[styles.title,{color: activeColors.text} ]}>{title}</Text>
      <Text style={[styles.skeins,{color: activeColors.text}]}>
        <Text style={styles.skeinCount}>{items.length}</Text>
        {" "}{items.length === 1 ? "skein" : "skeins"}
      </Text>
      <View style={styles.gridContainer}>
        {items[0] && <YarnMiniThumbnail {...items[0]} />}
        {items[1] && <YarnMiniThumbnail {...items[1]} />}
        {items[2] && <YarnMiniThumbnail {...items[2]} />}

      </View>
      <>
        <EditBins id={id} modalVisible={modalVisible} setModalVisible={setModalVisible} onBinDeleted={onBinDeleted} /></>
    </Pressable>
  );
}

const INK = "#222222";
const OUTLINE = "#000000";
const WHITE = "#FFFFFF";
const BORDER = 4;
const RADIUS = 24;
const FONT_REGULAR = "Comfortaa_400Regular";
const FONT_BOLD = "Comfortaa_700Bold";

const styles = StyleSheet.create({
  container:{
  width:'95%',
 
  borderWidth: BORDER,
 
  borderRadius: RADIUS,
  paddingHorizontal: 16,
  paddingVertical: 14,
  margin: 10,
 },
 title:{
  fontSize: 28,
  lineHeight: 34,
  fontFamily: FONT_REGULAR,
 
 },
 skeins:{
  fontSize: 16,
  fontFamily: FONT_REGULAR,
  
 },
skeinCount:{
  fontFamily: FONT_BOLD,
 },
  gridContainer: {
   flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 16,
  },


});