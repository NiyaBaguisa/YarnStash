import {Modal, Button, Pressable, View, Image, Text, TouchableOpacity, Animated, StyleSheet, FlatList,} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';// define what a search result yarn looks like

type RavelrySearchResult = {
  id: number;
  name: string;
  gauge_divisor?: number;
  [key: string]: any; // allow other fields from the API without listing every one
};

//fiber
type Fiber ={
  [key: string] : any;
}

interface ScannedYarnData {
  binId: number;
  image: string;
  yarnName: string;
  brandName: string;
  color: string;
  colorWay: string;
  weight: string;
  fiber: string[];
  skeins: string;
}

type TopMatchesProps = {
  visible: boolean;
  onClose: () => void;
  matches: RavelrySearchResult[];
  upcItem?: ScannedYarnData;
  parsedColorway: string;
};
export default function TopMatches({ visible, onClose, matches, upcItem, parsedColorway }: TopMatchesProps){
//filled in data for the form

 const router = useRouter();

  // the final yarn data to be passed to the form
const [yarnData, setYarnData] = useState<ScannedYarnData>();
   
useEffect(() => {
  console.log("This is the data passed to the modal: ", matches);
  console.log("this is the scanned item: ", upcItem);
}, [matches, upcItem]);   
      
function handlechosen(item: RavelrySearchResult){
  console.log("TOPMATCHES: handlechosen fired", item.name)
  //combine the data from the chosen match with the upc scan data
  //loop through fiber array and pull out the names of each 
  const fiberArr = item.fiber.map((f : Fiber)=> f.fiber_category.name);
//console.log('item.fiber: ',item.fiber[0].fiber_category.name)
     const confirmedData={
      "binId": 0,
          "image": upcItem?.image || item.first_photo?.square_url || '', //upc
      "yarnName": item.name || '', //Ravelry
  "brandName":item.yarn_company_name || '', //upc if null then raveley (maybe)
  "color": upcItem?.color || '', // upc
  "colorWay" : parsedColorway || '', //upc+ ravelry
  "weight": String(item.gauge_divisor) || "0", // ravelry
  "fiber": fiberArr || [], //ravelry,
  'skeins': "1",
        }
setYarnData(confirmedData)

//close modal
onClose();
router.push({pathname: '/(tabs)/addYarn',
  params:{scannedYarn: JSON.stringify(confirmedData)}
})
        

}

useEffect(()=>{
console.log('data to be passed to form: ', yarnData);


},[yarnData])
const renderItem = ({item}:{item: RavelrySearchResult} ) => {
   const imageUri =
    upcItem?.image ||
    item.first_photo?.square_url ||
    null;

  return(
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={()=> handlechosen(item)}>
      <View>
      <Image
          style={styles.image}
          source={
            imageUri
              ? { uri: imageUri }
              : require('../../assets/images/default-img.png')
          }
        />
                </View>
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detailText}>Brand: {item.yarn_company_name}</Text>
      <Text style={styles.detailText}>Color way: </Text>
      <Text style={styles.detailText}>Weight: #{item.gauge_divisor} {item.yarn_weight.name}</Text>
      <Text style={styles.detailText}>Fiber:</Text>

                </View>
      
    </Pressable>);}

    return(
        <SafeAreaView style={styles.container}>
            <Modal visible={visible} 
            animationType='slide'
            onRequestClose={onClose}>
<View style={styles.modalContent}>
  <View style={styles.header}>
    <Text style={styles.title}>Results</Text>
    <Pressable onPress={onClose}>
      <Text>Close</Text>
    </Pressable>

  </View>
    
    <View style={styles.listContainer}>
        <FlatList
        data={matches}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}/>
    </View> 
 
</View>
</Modal>
        </SafeAreaView>
    )
}
const INK = '#222222';
const OUTLINE = '#000000';
const BG = '#FFFFFF';
const FONT_REGULAR = 'Comfortaa_400Regular';
const FONT_BOLD = 'Comfortaa_700Bold';
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: BG
  },
  header : {
 flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
   fontFamily: FONT_BOLD,
    marginBottom: 12,
    color: INK
  },
  listContainer: {
    width: '100%',
    maxWidth: 500,
    flex: 1,
     alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: BG,
    borderWidth: 4,
    borderColor: OUTLINE,
    borderRadius: 24,
    padding: 12,
  },
  cardPressed: {
    opacity: 0.85,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  details : {
    flex: 1
  },
   name: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: INK,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FONT_REGULAR,
    color: INK,
  },
});