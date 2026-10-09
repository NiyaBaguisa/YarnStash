import { TextInput, View, ScrollView, Modal,Pressable, StyleSheet, Button, Text, Image, Alert, FlatList, ImageSourcePropType } from 'react-native';
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import * as ImagePicker from 'expo-image-picker';
import {useState, useEffect, useMemo, useCallback} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Link, useRouter, Tabs, useFocusEffect, useLocalSearchParams} from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import ChipInput from '@/components/ChipInput';

type Inputs ={
  binId: number
  image: string
  yarnName: string
  brandName: string
  color: string
  colorWay: string
  weight: string
  fiber: string[]
  skeins: string
  
}

type Bin ={
  id: number;
  title: string;
}

type Weight ={
  id: number,
  name: string,
  image: ImageSourcePropType,
}
export interface ScannedYarnData {
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
export default function AddYarn() {
// arr of bin options
const [binOptions, setBinOptions] = useState<Bin[]>([]);
//use state for the bin dropdown
const [selectedBin, setSelectedBin] = useState<Bin>(); 
// state for visibiltity of new bin modal
const [isModalVisible, setIsModalVisible] = useState(false);
//state for bin name user input
const [inputBin, setInputBin] = useState('');
//state for bin dropdown
const [isDropdownVisible, setIsDropdownVisible] = useState(false);
// data for weight input
const weights: Weight[] =[
   {
    id: 0,
    name: 'Lace',
    image: require('@/assets/images/weightImages/Weight-0-Lace.jpg'),
  },
  {
    id: 1,
    name: 'Super Fine',
    image: require('@/assets/images/weightImages/Weight-1-SuperFine.jpg'),
  },
  {
    id: 2,
    name: 'Fine',
    image: require('@/assets/images/weightImages/Weight-2-Fine.jpg'),
  },
  {
    id: 3,
    name: 'Light',
    image: require('@/assets/images/weightImages/Weight-3-Light.jpg'),
  },
  {
    id: 4,
    name: 'Medium',
    image: require('@/assets/images/weightImages/Weight-4-Medium.jpg'),
  },
  {
    id: 5,
    name: 'Bulky',
    image: require('@/assets/images/weightImages/Weight-5-Bulky.jpg'),
  },
  {
    id: 6,
    name: 'Super Bulky',
    image: require('@/assets/images/weightImages/Weight-6-SuperBulky.jpg'),
  },
  {
    id: 7,
    name: 'Jumbo',
    image: require('@/assets/images/weightImages/Weight-7-Jumbo.jpg'),
  },
];
//state for selected weight
const [selectedWeight, setSelectedWeight] = useState<Weight>(weights[0]);
//fiber arr chips created
    const [chips, setChips]= useState<string[]>([]); 
//use state for the image picker
  const [image, setImage] = useState<string>('');
// camera variables
      const [permission, requestPermission] = useCameraPermissions();
//empty form values
const emptyForm: Inputs = {
  binId: 1, image: '', yarnName: '', brandName: '', color: '',
  colorWay: '', weight: '', fiber: [], skeins: '1',
};
const router = useRouter();

   // parameters inherited from topMatches
 const {scannedYarn} = useLocalSearchParams<{scannedYarn:string}>(); 
 //parse the scannedYarn JSON string
 const parsedScannedYarn = useMemo(()=>{
  //scannedyarn is falsy return 
  if(!scannedYarn){return;}
    try{
return JSON.parse(scannedYarn) as ScannedYarnData;
    }catch(e){
      console.error("Failed to parse scanned yarn params data", e);
    } 
    //if the scanned yarn canot be parsed return empy form
    if(!parsedScannedYarn){
      return emptyForm;
    }
  
 },[scannedYarn]);

  const pickImage = async()=>{
    //request user permission to access photo library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //if permission is NOT granted alert user that permission is needed
    if (!permissionResult.granted){
      Alert.alert('Permission required', 'Permission to access the media Library is required.');
      return;
    }

    //if permission granted launch the image library picker

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes:'images',
    quality: 0.5,
    allowsEditing: true
  });

  console.log(result);
  
  //if the user backs out of upload, cancel operation

  if(!result.canceled){
    const uri = result.assets[0].uri;
    setImage(uri);
    setValue('image', uri);
  }
  };

  const {reset, handleSubmit, control, setValue, formState: {errors},} = useForm<Inputs>();
 //connect to db
 const db = useSQLiteContext();

   //load bin table
   const loadBinList = async()=>{
    try{
      //select only unique values from bin table
            const results = await db.getAllAsync(`SELECT * FROM bins
                ORDER BY id DESC `);
                setBinOptions( results as Bin[])
                console.log("here are the unique values in the bins table: ",results)
           
        }catch(e){
            console.log("error loading bin data", e)

 }

   };

   useEffect(()=>{
        loadBinList();
    }, [])
//on bin title press, set that bin to selected bin
function handleRItemPress(item: Bin){
  setSelectedBin(item);
  setValue('binId', item.id)
  setIsDropdownVisible(false);

}
    //this is how each bin in the bin options should be shown on the screen
    const rItem = ({item}: {item : Bin}) =>{
      //on bin title press, set that bin to selected bin
      return(
        <Pressable onPress={()=>handleRItemPress(item)} style={styles.dropdownItem}>
        <Text>
          {item.title}
          </Text>
      </Pressable>

      )
      
    }

    //toggle the dropdown
    function toggleDropdown (){
      setIsDropdownVisible(prev => !prev);
    }

    //show the dropdown on dropdown preview button press
    function handleDropdown (){
      if(isDropdownVisible){
        return(
          <Modal visible={isDropdownVisible} transparent>
            <Pressable 
            style={styles.overlay}
            onPress={()=>setIsDropdownVisible(false)}>
            <SafeAreaView style={styles.dropdownContainer}>
              <FlatList
              data={binOptions}
              renderItem={rItem}
              keyExtractor ={(item)=> item.id.toString()}
               ListFooterComponent={
              <Pressable onPress={handleNewBinButtonPress}>
               <Text>+ Add New Bin</Text>
               </Pressable>
  }/>
              
            </SafeAreaView>
            </Pressable>

          </Modal>
        )
      }
    }

    //handle add new bin button press 
    function handleNewBinButtonPress(){
      //show modal
      setIsModalVisible(true);
    }

    //add data to bin table
    const addNewBin = async()=>{
        if(!inputBin.trim()){
        Alert.alert('Bin name required')
        return;
    }
      try{
       const result= await db.runAsync('INSERT INTO bins (title) VALUES(?)',[inputBin]);
           console.log('a new bin named: ', inputBin ,'was added');
           //reload the bin list
           await loadBinList();
          
           // reset bin input
           setInputBin('')
           // close the add new bin modal
           setIsModalVisible(false);

      }catch(e){
         console.log('error logging new bin into database', e)

      }
    
    }

    //handle press for selected weight
    function handleWeightPress(item: Weight){
  setValue('weight', item.name);
  setSelectedWeight(item);
 

}

    //custom weights input component
    function inputWeights(){
      return(
        <>
         {weights.map((item : Weight) =>
          <Pressable key={item.id} onPress={()=> handleWeightPress(item)}>
          <Image
          source= {item.image}
          style={[styles.weightImage, selectedWeight.id === item.id && styles.selectedWeightImage]}/>
          </Pressable>
        )}
        </>
       
      )
    }

    
  //on submit log the data to thre console
  const onSubmit: SubmitHandler<Inputs> = async(data) => {
    try{
       await db.runAsync(
        //add data to master yarn table ADJUST BIN DATA
    'INSERT INTO master (binId, image, yarnName, brandName, color, colorWay, weight, fiber, skeins) VALUES (?,?,?,?,?,?,?,?,?)',
    [Number(data.binId), data.image || '', data.yarnName, data.brandName, data.color, data.colorWay, data.weight, JSON.stringify(data.fiber), Number(data.skeins)]
   );
   
   
    console.log(data)
    //to do: clear form
    reset();
    } catch(e){
      console.log('error logging data into yarn database: ',e)
    }
  
  };
 
//import data from search params to form fields

  useEffect(() => {
    console.log("ADDYARN focused, context yarnName =", parsedScannedYarn?.yarnName || "Yarn Name");

    //weight conversion
    const scannedWeight = weights.find(
  (w) =>
    w.id === Number(parsedScannedYarn?.weight) ||
    w.name === parsedScannedYarn?.weight
);

// set the fiber chips 
if(parsedScannedYarn){
  setChips(parsedScannedYarn.fiber)

}

reset({
  binId: 0,
  image: parsedScannedYarn?.image,
  yarnName: parsedScannedYarn?.yarnName,
  brandName: parsedScannedYarn?.brandName,
  color: parsedScannedYarn?.color,
  colorWay: parsedScannedYarn?.colorWay,
 weight: scannedWeight?.name ?? '',
  fiber: parsedScannedYarn?.fiber,
  skeins: parsedScannedYarn?.skeins, 
})
if(scannedWeight){
  setSelectedWeight(scannedWeight)
}
}, [parsedScannedYarn])

  useEffect(()=>{
     setValue('fiber', chips);
        console.log("current fiber list: ", chips);
    }, [chips])

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

 
  return (

    <SafeAreaView>
       <Modal
    transparent ={true}
    visible ={isModalVisible}
    onRequestClose={()=>{
      Alert.alert('modal has been closed.');
      setIsModalVisible(false);
    }}>
      <Pressable 
      style={styles.overlay}
      onPress={()=>setIsModalVisible(false)}>
      <SafeAreaView style={styles.modalContentContainer}>
        <Text>Please Input New Bin Name:</Text>
          
          <TextInput
          style={styles.input}
            placeholder="New Bin Name"
              placeholderTextColor="#999999"
            onChangeText={setInputBin}
            value={inputBin}
          />
       
        <Pressable
         onPress={addNewBin}>
          <Text>Add Bin</Text>
        </Pressable>
       
      </SafeAreaView>
      </Pressable>

    </Modal>

  
    <ScrollView >
      
    <Pressable
    onPress={toggleDropdown}>
{handleDropdown()}
<Text>{selectedBin && selectedBin.title || `▾ Show Dropdown` }</Text>

    </Pressable>

      <View style={styles.imageContainer}>
        <Button title="choose an image from camera roll" onPress={pickImage}/>
        {image && <Image source={{uri:image}} style={styles.image}/>}
      </View>

      <View style={styles.controllerGroup}>
        <Text>Yarn Name</Text>
        <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
          style={styles.input}
            placeholder="Yarn name"
              placeholderTextColor="#999999"
            onChangeText={onChange}
            value={value}
          />
        )}
        name="yarnName"
      />

      </View>

      <View style={styles.controllerGroup}>
        <Text>Brand Name</Text>
        <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange,  value } }) => (
          <TextInput
          style={styles.input}
            placeholder="Brand name"
              placeholderTextColor="#999999"
            onChangeText={onChange}
            value={value}
          />
        )}
        name="brandName"
      />
      </View>
<View style={styles.controllerGroup}>
        <Text>Yarn Color</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
          style={styles.input}
            placeholder="Yarn color"
              placeholderTextColor="#999999"
            onChangeText={onChange}
            value={value}
          />
        )}
        name="color"
      />
     </View>

     <View style={styles.controllerGroup}>
        <Text>Color Way</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
          style={styles.input}
            placeholder="color way"
              placeholderTextColor="#999999"
            onChangeText={onChange}
            value={value}
          />
        )}
        name="colorWay"
      />
     </View>

<View style={styles.controllerGroup}>
        <Text>Yarn Weight</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
    {inputWeights()}
  </View>
     
      </View>

<View style={styles.controllerGroup}>

      <ChipInput chips ={chips} setChips={setChips}/>
      </View>
      


  <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
          style={styles.input}
            placeholder="How many skeins or cakes"
              placeholderTextColor="#999999"
            inputMode='numeric'
            keyboardType='numeric'
            
            onChangeText={onChange}
            value={value}
          />
        )}
        name="skeins"
      />

       {/*error handling TO DO:change span to text*/}
       
        {errors.yarnName && <span>This field is required</span>}
         {errors.brandName && <span>This field is required</span>}
          {errors.color&& <span>This field is required</span>}
            {errors.fiber && <span>This field is required</span>}
             {errors.skeins && <span>This field is required</span>}

        <Button title="Submit" onPress={handleSubmit(onSubmit)}/>

<Pressable
  disabled={!permission?.granted}
  onPress={() => router.push('/upcscan')}
>
  <Text>Scan Code</Text>
</Pressable>

     
    </ScrollView>
      </SafeAreaView>
  );
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
  controllerGroup:{
    width: '90%',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  imageContainer:{
    flex:1 ,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image:{
    width: 200,
    height: 200
  },
  overlay:{
    width: '100%',
    height: '100%'
  },
  modalContentContainer: {
backgroundColor: '#FFFFFF',
  margin: 24,
  padding: 20,
  borderRadius: 12,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 5,
  },
  dropdownContainer:{
    backgroundColor: '#FFFFFF',
  marginTop: 80,
  marginHorizontal: 24,
  padding: 16,
  borderRadius: 12,
  maxHeight: '70%',
  elevation: 5,

  },
  dropdownItem: {
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: '#E5E5E5',
},
weightImage:{
  width: 60,
  height: 60,
  margin: 4,
  opacity: 0.65
},
selectedWeightImage: {
 borderWidth: 3,
  borderColor: '#5B8C5A',
  borderRadius: 8,
  opacity: 1,
}

 
});
