import { TextInput, View, StyleSheet, Button, Text, Image, Alert } from 'react-native';
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import { useSQLiteContext } from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import {useState, useEffect} from 'react';

// add the data from the yarn form to the inventory json file
//fetch data from json file and sort them into bins
type Inputs ={
  bin: string
  photo: string
  yarnName: string
  brandName: string
  color: string
  weight: string
  fiber: string
  skeins: string
  
}
export default function AddYarn() {
  //use state for the image picker
  const [image, setImage] = useState<string>('example image url')

  const pickImage = async()=>{
    //request user permission to access photo library
  }

  const {reset, handleSubmit, control, formState: {errors},} = useForm<Inputs>();
 //connect to db
 const db = useSQLiteContext();

  //on submit log the data to thre console
  const onSubmit: SubmitHandler<Inputs> = async(data) => {
    try{
       await db.runAsync(
    'INSERT INTO master (yarnName, brandName) VALUES (?,?,?,?,?,?,?,?)',
    [data.bin, data.photo, data.yarnName, data.brandName, data.color, Number(data.weight), data.fiber, Number(data.skeins)]
   );
   
    console.log(data)
    //to do: clear form
    reset();
    } catch(e){
      console.log('error logging data into database: ',e)
    }
  
  };
 

 
  return (
    <View style={styles.container}>
    
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
          style={styles.input}
            placeholder="Choose a bin"
            placeholderTextColor="#999999"
            
            onChangeText={onChange}
            value={value}
          />
        )}
        name="bin"
      />


      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
          style={styles.input}
            placeholder="Add Photo"
              placeholderTextColor="#999999"
            onChangeText={onChange}
            value={value}
          />
        )}
        name="photo"
      />

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

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDFDFD'

    
  },
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
  }
 
});
