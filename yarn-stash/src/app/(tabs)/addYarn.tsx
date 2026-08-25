import { TextInput, View, ScrollView, Modal,Pressable, StyleSheet, Button, Text, Image, Alert } from 'react-native';
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import {Picker} from '@react-native-picker/picker';
import { useSQLiteContext } from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// add the data from the yarn form to the inventory json file
//fetch data from json file and sort them into bins
type Inputs ={
  binId: number
  image: string
  yarnName: string
  brandName: string
  color: string
  weight: string
  fiber: string
  skeins: string
  
}
export default function AddYarn() {
// arr of bin options
const [binOptions, setBinOptions] = useState<string []>([]);
//use state for the bin dropdown
const [selectedBin, setSelectedBin] = useState(''); 
// state for visibiltity of new bin modal
const [isModalVisible, setIsModalVisible] = useState(false);
//state for bin name user input
const [inputBin, setInputBin] = useState('');


  //use state for the image picker
  const [image, setImage] = useState<string>('');

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
            const results = await db.getAllAsync(`SELECT DISTINCT title FROM bins
                ORDER BY id DESC `);
                setBinOptions( (results as string[]).map(row => Object.values(row)[0]))
                console.log("here are the unique values in the bins table: ",binOptions)
           
        }catch(e){
            console.log("error loading bin data", e)

 }

   };

   useEffect(()=>{
        loadBinList();
    }, [])

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
        await db.runAsync('INSERT INTO bins (title) VALUES(?)',[inputBin]);
           console.log('a new bin named: ', inputBin ,'was added');

      }catch(e){
         console.log('error logging new bin into database', e)

      }
    
    }

  //on submit log the data to thre console
  const onSubmit: SubmitHandler<Inputs> = async(data) => {
    try{
       await db.runAsync(
        //add data to master yarn table ADJUST BIN DATA
    'INSERT INTO master (binId, image, yarnName, brandName, color, weight, fiber, skeins) VALUES (?,?,?,?,?,?,?,?)',
    [data.binId || 'Default Bin', data.image || '', data.yarnName, data.brandName, data.color, Number(data.weight), data.fiber, Number(data.skeins)]
   );
   
   
    console.log(data)
    //to do: clear form
    reset();
    } catch(e){
      console.log('error logging data into yarn database: ',e)
    }
  
  };
 

 
  return (

    <SafeAreaView>
       <Modal
    transparent ={true}
    visible ={isModalVisible}
    onRequestClose={()=>{
      Alert.alert('modal has been closed.');
      setIsModalVisible(false);
    }}>
      <SafeAreaView>
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
      

    </Modal>

  
    <ScrollView >
    
   

   
         <Button title="+" onPress={handleNewBinButtonPress}>

    </Button>

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
        <Text>Yarn Weight</Text>
 <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
          style={styles.input}
            placeholder="Yarn Weight"
              placeholderTextColor="#999999"
            inputMode='numeric'
            keyboardType='numeric'
            
            onChangeText={onChange}
            value={value}
          />
        )}
        name="weight"
      />
      </View>

<View style={styles.controllerGroup}>
        <Text>Yarn Fiber Content</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
          style={styles.input}
            placeholder="Fiber"
              placeholderTextColor="#999999"
            onChangeText={onChange}
            value={value}
          />
        )}
        name="fiber"
      />
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

       {/*error handling*/}
        {errors.yarnName && <span>This field is required</span>}
         {errors.brandName && <span>This field is required</span>}
          {errors.color&& <span>This field is required</span>}
           {errors.weight && <span>This field is required</span>}
            {errors.fiber && <span>This field is required</span>}
             {errors.skeins && <span>This field is required</span>}
        <Button title="Submit" onPress={handleSubmit(onSubmit)}/>

     
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
  }
 
});
