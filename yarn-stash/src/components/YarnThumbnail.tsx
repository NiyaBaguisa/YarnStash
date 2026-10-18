// this is where the boxes for the yarn is made and then the bins and the horizontal scroll bars will just take in this component
import { Text, View,Image, Pressable, StyleSheet } from "react-native";
import EditYarn from "./EditYarn";
import { useState } from "react";

// type for yarn object
interface Yarn{
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

interface YarnThumbnailProps{
  item : Yarn,
   isYarnSelected: boolean,
    setIsYarnSelected: (value: boolean)=>void,
  selectedYarn?: Yarn,
  setSelectedYarn: (item: Yarn | undefined) => void,
  onYarnDeleted: ()=> void;
  

}

export default function YarnThumbnail({item, isYarnSelected, setIsYarnSelected, selectedYarn, setSelectedYarn, onYarnDeleted}: YarnThumbnailProps){

  const weights: string[] = ['Lace', 'Super Fine', 'Fine', 'Light', 'Medium', 'Bulky', 'Super Bulky', 'Jumbo'];
  const weightDisplay = `${item.weight} ${weights.indexOf(item.weight)}`

  //modal visibilty state
  const [modalVisible, setModalVisible] = useState(false);

    //when thumbnail is pressed pass up the state
  function handlePress(){
    setSelectedYarn(item);
    setIsYarnSelected(true);


  };

  //handle long press to bring up editing /deleteing modal
  function handleLongPress(){
    setModalVisible(true);
    console.log('you long pressed the yarn thumbnail', modalVisible);;
  }
  
  return(
      <Pressable onPress={handlePress} onLongPress={handleLongPress}>

     
        <View style={styles.thumbnailContainer}>
          <View style={styles.thumbnail}>
            {item.image ? (
              <Image style={styles.image} source={{ uri: item.image}} />
            ) : (
              <Image style={styles.image} source={require('../../assets/images/default-img.png')} />
            )}
          </View>
            <View style={styles.detailsContainer}>
             <Text style={styles.h1}>{item.yarnName}</Text>
              <Text >{item.brandName}</Text>
               <Text >{item.color}</Text>
               <Text style={styles.fiberTag}>{item.fiber}</Text>
       
{/* line*/}
<Text>{item.skeins} Skeins</Text>


           </View>
                   <Text style ={styles.weightTag}>{weightDisplay}</Text>
          
        </View>
        <EditYarn id={item.id} modalVisible ={modalVisible} setModalVisible={setModalVisible} onYarnDeleted= {onYarnDeleted}/>
         </Pressable>

    )
}

const styles = StyleSheet.create({
  thumbnailContainer:{
  width: 200,
  height: 250,
  
    alignItems: 'center',
  
  borderRadius: 16
  },
  thumbnail:{
    width: '100%',
    height: '55%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  detailsContainer:{
    backgroundColor: '#d9d9d9',
    width: '100%',
    height: '50%',
    borderRadius: 16,
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    padding: 10

   
    
  },
  h1:{
    fontSize: 16,
    fontWeight: 'bold'


  }, 
  
  fiberTag:{
 backgroundColor: 'white',
    padding: 5,
    borderRadius: 50,
  
  },
  weightTag:{
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'red',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 50,
  },
  image:{
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }

  
});