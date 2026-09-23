import {Modal, Button, Pressable, View, Image, Text, TouchableOpacity, Animated, StyleSheet, FlatList,} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';// define what a search result yarn looks like

//TO DO: TAKE IN THE UPC DATA AS WELL FOR THE IMAGE, BRAND, COLOR
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

//scanned yarn object
type ScannedYarn ={
  image: string,
  yarnName: string,
  brandName: string,
  color: string,
  colorWay: string,
  weight: number,
  fiber: string[];
}

type TopMatchesProps = {
  visible: boolean;
  onClose: () => void;
  matches: RavelrySearchResult[];
  upcItem?: ScannedYarn;
};
export default function TopMatches({ visible, onClose, matches, upcItem }: TopMatchesProps){


  // the final yarn data to be passed to the form
const [yarnData, setYarnData] = useState<ScannedYarn>();
   
useEffect(() => {
  console.log("This is the data passed to the modal: ", matches);
  console.log("this is the scanned item: ", upcItem);
}, [matches, upcItem]);

  //loop through matches and add in new data from upc scan to each item
  // new array that holds the combined values from both the upcitem and from the match

//loop through best matches and show fiber content
    //get the fiber content from the queried id



function confirmResult(){       
       // setYarnData(confirmedData)
        // TO DO: close camera view,send the query data to the add yarn form
        //reset isScanned back to false
      
}
function handlechosen(item: RavelrySearchResult){
  //combine the data from the chosen match with the upc scan data
  //loop through fiber array and pull out the names of each 
  const fiberArr = item.fiber.map((f : Fiber)=> f.fiber_category.name);
console.log('item.fiber: ',item.fiber[0].fiber_category.name)
     const confirmedData={
          "image": upcItem?.image || item.first_photo?.square_url || '', //upc
      "yarnName": item.name, //Ravelry
  "brandName":item.yarn_company_name, //upc if null then raveley (maybe)
  "color": upcItem?.color || '', // upc
  "colorWay" : upcItem?.colorWay || '', //upc+ ravelry
  "weight": item.gauge_divisor || 0, // ravelry
  "fiber": fiberArr //ravelry
        }
setYarnData(confirmedData)

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
    <Pressable onPress={()=> handlechosen(item)}>
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
      <Text>{item.name}</Text>
      <Text>Brand: {item.yarn_company_name}</Text>
      <Text>Color way: </Text>
      <Text>Weight: #{item.gauge_divisor} {item.yarn_weight.name}</Text>
      <Text>Fiber:</Text>
    </Pressable>);}

    return(
        <SafeAreaView style={styles.container}>
            <Modal visible={visible} 
            animationType='slide'
            onRequestClose={onClose}>
<View style={styles.modalContent}>
    <Text style={styles.title}>Results</Text>
    <Button title="Close" onPress={onClose}/>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listContainer: {
    width: '100%',
    maxWidth: 500,
    flex: 1,
  },
  listContent: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
});