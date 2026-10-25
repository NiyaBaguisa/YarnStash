
import { TextInput, View, ScrollView, Modal,Pressable, ActivityIndicator, StyleSheet, Button, Text, Image, Alert, FlatList, ImageSourcePropType } from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import TopMatches from '@/components/TopMatches';
import Loading from '@/components/Splash/Loading';
import { reset } from 'expo-router/build/react-navigation/routers/CommonActions';
import ScannerUI from '@/components/Splash/ScannerUI';


// define what a search result yarn looks like
type RavelrySearchResult = {
  id: number;
  name: string;
  gauge_divisor?: number;
  [key: string]: any; // allow other fields from the API without listing every one
};

type RavelryColorResult = {
  id: number;
  name: string;
  [key: string]: any; // allow other fields from the API without listing every one
};
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
export default function UPCScan(){
    //Camera states
    const [facing, setFacing] = useState<CameraType>('back');
const [permission, requestPermission] = useCameraPermissions();
//state for top matches modal
const [visible, setIsVisible] = useState(false);
    // state for if anything has been scanned
    const [isScanned, setIsScanned] = useState<Boolean>(false);
// store scanned result code number
const [code, setCode] = useState("");
//store colorway
const [parsedColorway, setParsedColorway] = useState("")
//store scanned result upc data !! NOT THE SAME AS THE FINAL SCANNED YARN DATA
const [upcItem, setupcItem] = useState<ScannedYarnData>()
// top matches for user to confirm and choose from 
const [topMatches, setTopMatches] = useState<RavelrySearchResult[]>([]);
// loading for api fetch
const [isLoading, setIsLoading] = useState(false)

// list of weights to search for in description
const weights =[
   'lace', 'fingering', 'sport', 'dk', 'double knit',
  'worsted', 'aran', 'bulky', 'super bulky', 'jumbo', 'medium', 'super fine', 'fine', 'light',
];
//list of fibers to search for in description
const fibers =[
'acrylic', 'wool', 'cotton', 'alpaca', 'bamboo', 'silk',
  'nylon', 'polyester', 'mohair', 'cashmere', 'linen', 'rayon', 'viscose', 'chenille', 'angora'
];
// list of common color words to strip out of yarn titles (sorted longest-first later so multi-word colors match before single words)
const colors = [
  'royal blue', 'sky blue', 'hot pink', 'forest green', 'lime green',
  'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink',
  'black', 'white', 'brown', 'gray', 'grey', 'teal', 'navy', 'maroon',
  'beige', 'tan', 'gold', 'silver', 'cream', 'ivory', 'burgundy',
  'lavender', 'turquoise', 'coral', 'mint', 'charcoal', 'rust', 'mustard',
  'mauve','light pink', 'light green', 'light blue'
];
// generic filler words that show up in yarn titles but aren't part of a colorway name
const fillerWords = ['yarn', 'solid', 'solids', 'skein', 'ball', 'multi', 'variegated', 'variety'];

//RAVELRY CREDENTIALS
const apiusername = process.env.EXPO_PUBLIC_username
const apipassword = process.env.EXPO_PUBLIC_password;
const encoded = btoa(`${apiusername}:${apipassword}`);

//router declaration
const router = useRouter();
//Reset everything when the screen comes into focus

useFocusEffect(
  useCallback(() => {
    // Do something when the screen is focused
    setIsVisible(false);
    setIsScanned(false);
    setIsLoading(false);
    setCode("");
    setupcItem(undefined);
    setTopMatches([]);
  
    return () => {
      // Do something when the screen is unfocused
     
    };
  }, [])
);
// put the screen back to its starting state so the camera can scan again
function resetScan(){
  setIsLoading(false);
  setIsVisible(false);
  setIsScanned(false);
  setCode("");
  setupcItem(undefined);
  setTopMatches([]);
}

// Use the name of thee product from the upcscan to query same item in ravelry
async function fetchRavelry(query : string) {
  
  try {
   const response = await fetch(`https://api.ravelry.com/yarns/search.json?query=${encodeURIComponent(query)}&sort=best&page_size=10`, {
   // method: "GET",
    headers: {
      Authorization: `Basic ${encoded}`,
    },
  });

    if (!response.ok) {
      console.error(`Request failed: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error(errorBody);
      resetScan();
      return;
    }
// data  is a page of the results (object)
    const data = await response.json();
   
    console.log("query used for initial ravelry search: ", query )
  console.log("Success:", data);
   
   // store the best matches in an array 
     let bestMatches : RavelrySearchResult[]=[];
// loop through the top 10 and query for colorway

for (const item of data.yarns as RavelrySearchResult[]) {
  //search id 
  const searched = await queryId(item.id );
  //query colorway
      const isMatch = await queryColorway(searched, item.name);
      if (isMatch === true) {
        //add the fiber to the item and push to the best matches arr
        const newItem = {...item, fiber: searched.yarn.yarn_fibers}
        bestMatches.push(newItem);
      }
     console.log(`Result ${item.id} of ravelry fetch: ${item.name}`);
    
    }

    console.log(bestMatches.length, "Best matches:", bestMatches);
    if(bestMatches.length > 0){
      setTopMatches(bestMatches);
setIsVisible(true)

    }else if(bestMatches.length ==0 && upcItem){
      fillUPC(upcItem)

    }else{
      alert('There were 0 matches in our current database.')
      setIsVisible(false);
    setIsScanned(false);
    setCode("");
    setupcItem(undefined);
    setTopMatches([]);
    }
    

  } catch (e) {
    console.error("Error making Ravelry fetch request:", e);
    resetScan();
  }finally {
    setIsLoading(false);
  }
}

// reutrns a yarn object
async function queryId(yarnId: number){
 try{
    const response = await fetch(`https://api.ravelry.com/yarns/${yarnId}.json?include=colorways`, {
      headers: { Authorization: `Basic ${encoded}` },
    });
if (!response.ok) {
      console.error(`Ravelry ID fetch failed for yarn ${yarnId}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    
return data;

}catch(e){
console.error("Error making Ravelry fetch request:", e);
}
}


async function queryColorway( searched: RavelrySearchResult, ravelryName: string){
  if (!searched){
    return;
  }
  try{ 
    // get the coloway arr from the queried id
    const colorwayArr = searched.colorways;
    //only return the names of the colorway options 
    const colorwayData =  colorwayArr.map((color: RavelryColorResult) => color.name.toLowerCase().trim())
     //console.log(`colorway query result: `,colorwayData);
  
     if(upcItem){
       //the parsed colorway value from the upcscan
       const parsedColor = parseColorway(upcItem.yarnName, upcItem.brandName, ravelryName);
     setParsedColorway(parsedColor);


     // is the parsed colorway from the upcscan included in the colorway data array in any of the top three
     if(colorwayData.includes(parsedColor)){
      console.log(searched.id, "contains parsed Colorway: ", parsedColorway, " --true")
      
     return(true);

     }else{
      console.group(searched.id, "contains parsed colorway:  ", parsedColorway, " --false");
      return(false)
     }

     }


  }catch(e){
console.error("Error making colorway request:", e);
  }
}

// upcitemdb api fetch using scanned barcode
async function fetchYarn(){
  if (!code) return;
  
  try{
    const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`);
    setIsLoading(true);
    //parse json
    const result = await response.json();
    
    const item = result.items?.[0];
        if (!item) {
      console.log("No product found for UPC:", code, result);
      Alert.alert("Not found", "That barcode isn't in the database. Try another or add it manually.");
      setIsScanned(false); // let the camera scan again
      setIsVisible(false);
   setIsLoading(false);
    setCode("");
    setupcItem(undefined);
    setTopMatches([]);
      return;
    }

console.log(item)
    const scannedItem= {
      "binId": 0,
      "image": item.images[0]?? "", 
      "yarnName": item.title, 
  "brandName": item.brand, 
  "color": item.color, 
  "colorWay" : "", 
  "weight": "0",
  "fiber": [],
  "skeins": "1", 

    }

    setupcItem(scannedItem);
      
  
  }  catch(e){
    console.log(e)
    resetScan();
  }
}

// if there are no matches from upc to ravelry fill the form with the known data from upc
function fillUPC(item : ScannedYarnData){
  const upcData : ScannedYarnData = {
    //bin id is user controlled
    binId: 0,
    image: item.image,
    yarnName : parseName(item.yarnName),
    brandName : item.brandName,
    color: item.color,
    colorWay: parseColorway(item.yarnName, item.brandName, parseName(item.yarnName)),
    fiber : [],
    weight:'',
    skeins: '1',
  }
  // push this data to the form and show the form
  router.push({
    pathname: '/(tabs)/addYarn',
    params: {scannedYarn : JSON.stringify(upcData)}
  })
}
//trigger according to if a code exists / was scanned
useEffect(()=>{
  //fetch data
fetchYarn();


},[code])

//trigger according to if the upc scan is fetched
useEffect(()=>{
if(!upcItem) return;

  fetchRavelry(parseName(upcItem.yarnName));


},[upcItem])


// camera permissions are still loading
    if(!permission){
        return <View/>
    }
    // camera permissions not granted => ask for permission
    if(!permission.granted){
        return(
            <View >
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Request permission" />
      </View>
        );
    }


// Alert that a barcode has been scanned
    function handleScan({type, data}: {type : string; data: string}){
      if (isScanned){
        return;
      }  
      setIsScanned(true);
      setIsLoading(true);
        setCode(data)
        console.log(`Bar code with type ${type} and data ${data} has been scanned!`)
        //(`Bar code with type ${type} and data ${data} has been scanned!`);

    }


// parse title for yarn name (removes commas/special characters, weight words, numbers, yardage, colorway, grams)
function parseName(text: string): string {
  let name = text.toLowerCase();

  // 1. keep only the portion before the first comma — fiber/weight/yardage details usually come after it
  name = name.split(',')[0];

  // 2. remove measurement patterns like "#4", "4oz/113g", "200 Yards"
  name = name.replace(/#\d+/g, '');
  name = name.replace(/\d+\s?(oz|ounces?|g|grams?|yards?|yds?)(\s?\/\s?\d+\s?(oz|ounces?|g|grams?|yards?|yds?))?/gi, '');

  // 3. remove any remaining standalone numbers
  name = name.replace(/\d+/g, '');

  // 4. remove weight words (reuses your existing weights list)
  weights.forEach(w => {
    const regex = new RegExp(`\\b${w}\\b`, 'gi');
    name = name.replace(regex, '');
  });

  // 5. remove color words — longest phrases first so "royal blue" matches before a stray "blue"
  const sortedColors = [...colors].sort((a, b) => b.length - a.length);
  sortedColors.forEach(c => {
    const regex = new RegExp(`\\b${c}\\b`, 'gi');
    name = name.replace(regex, '');
  });
// remove all text after the fiber words:
 // find the last fiber word's end position — now searching WITHIN `name`
  let lastFiberEndIndex = -1;
  fibers.forEach(f => {
    const regex = new RegExp(`\\b${f}\\b`, 'gi');
    let match;
    while ((match = regex.exec(name)) !== null) {
      const endIndex = match.index + match[0].length;
      if (endIndex > lastFiberEndIndex) {
        lastFiberEndIndex = endIndex;
      }
    }
  });

  // slice `name`, the SAME string the indices were calculated against — not the original `text`
  if (lastFiberEndIndex !== -1) {
    name = name.slice(0, lastFiberEndIndex);
  }

  // 6. strip leftover special characters, but keep apostrophes (so "Sugar'n" survives)
  name = name.replace(/[^a-zA-Z0-9'\s]/g, '');

  // 7. collapse extra whitespace and trim
  name = name.replace(/\s+/g, ' ').trim();

  return name;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
// parse title for colorway 
function parseColorway (title:string, brand :string, ravelryName: string){
 let leftover = title.toLowerCase().trim();
  
// 1. remove text within parentheses, including the parentheses themselves
  leftover = leftover.replace(/\([^)]*\)/g, '');

  // 2. remove measurement patterns like "#4", "2.5oz/709g", "120 Yards"
  leftover = leftover.replace(/#\d+/g, '');
  leftover = leftover.replace(/\d+(\.\d+)?\s?(oz|ounces?|g|grams?|yards?|yds?)(\s?\/\s?\d+(\.\d+)?\s?(oz|ounces?|g|grams?|yards?|yds?))?/gi, '');

  // 3. remove any remaining standalone numbers
  leftover = leftover.replace(/\d+/g, '');
// remove the actual Ravelry product-line name, word by word (handles cases where
  // word order/spacing differs slightly between the title and Ravelry's name)
  const lineWords = ravelryName.toLowerCase().trim().split(/\s+/);
  lineWords.forEach(word => {
    if (word.length < 2) return;
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
    leftover = leftover.replace(regex, '');
  });
  // 2. remove the brand name too, in case it wasn't fully captured by the clean name removal above
// remove brand word-by-word instead of as one exact phrase, so "Solids" vs "solid" doesn't block the match
  const brandWords = brand.toLowerCase().trim().split(/\s+/);
  brandWords.forEach(word => {
    if (word.length < 3) return; // skip tiny words like "&"
    const stem = word.replace(/s$/, ''); // crude singular/plural handling: "solids" -> "solid"
    const regex = new RegExp(`\\b${stem}s?\\b`, 'gi'); // matches "solid" or "solids"
    leftover = leftover.replace(regex, '');
  });

    // 5. remove weight words
  weights.forEach(w => {
    const regex = new RegExp(`\\b${w}\\b`, 'gi');
    leftover = leftover.replace(regex, '');
  });

  // 6. remove fiber words (missing before — this is why "cotton" survived)
  fibers.forEach(f => {
    const regex = new RegExp(`\\b${f}\\b`, 'gi');
    leftover = leftover.replace(regex, '');
  });
  // now actually strip the filler words that were missing before
  fillerWords.forEach(word => {
    leftover = leftover.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
  });
  // 3. strip leftover special characters, but keep apostrophes
  leftover = leftover.replace(/[^a-zA-Z0-9'\s]/g, '');

  // 4. collapse extra whitespace and trim
  leftover = leftover.replace(/\s+/g, ' ').trim();

  return leftover;
}
    
   if(isLoading){
    return(
      <Loading/>
    )
   }
    return(
        <SafeAreaView style= {styles.container}>
            <CameraView
            style={StyleSheet.absoluteFill} 
            facing ={facing} 
            barcodeScannerSettings={{barcodeTypes:['upc_e', 'upc_a', 'ean13', 'ean8']}}
            onBarcodeScanned={isScanned? undefined: handleScan}/>
           <ScannerUI title="barcode"/>
         <TopMatches visible={visible} onClose={()=>setIsVisible(false)} matches={topMatches} upcItem ={upcItem} parsedColorway={parsedColorway}/> 
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "ffffff",
    justifyContent: "center",
    alignItems: "center"
  }
});