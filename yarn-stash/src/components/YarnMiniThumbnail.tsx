// this is where the boxes for the yarn is made and then the bins and the horizontal scroll bars will just take in this component
import { Text, View,Image,  StyleSheet } from "react-native";
//import {ReactComponent as DefaultImage} from '@/assets/images/yarn-stash-yarn-ball-icon.svg';
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


export default function YarnMiniThumbnail(item: Yarn){

  const weights: string[] = ['Lace', 'Super Fine', 'Fine', 'Light', 'Medium', 'Bulky', 'Super Bulky', 'Jumbo'];
  const weightDisplay = `${item.weight} ${weights.indexOf(item.weight)}`
    return(
        <View style={styles.thumbnailContainer}>
        
            {item.image ? (
              <Image style={styles.image} source={{ uri: item.image}} />
            ) : (
              <Image style={styles.image} source={require('../../assets/images/default-img.png')} />
            )}
          </View>
          
     

    )
}

const styles = StyleSheet.create({
  thumbnailContainer:{
  width: 90,
  height: 90,
  backgroundColor: '#f5f5f5',
    alignItems: 'center',
    overflow: 'hidden',
    margin: 5
 
  },

  
  image:{
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }

  
});