// this is where the boxes for the yarn is made and then the bins and the horizontal scroll bars will just take in this component
import { Text, View,Image,  StyleSheet } from "react-native";

interface Yarn{
  yarnName: string;
  brandName: string;
  color: string;
  weight: number;
  fiber: string;
  skeins: number;
 image: any;
}
export default function YarnThumbnail(item: Yarn){
    return(
        <View style={styles.thumbnailContainer}>
          <Image style={styles.thumbnail} source={require('../../assets/images/yarn-stash-yarn-ball-icon.svg')}/>
           <View style={styles.detailsContainer}>
             <Text>{item.yarnName}</Text>
              <Text>{item.brandName}</Text>
               <Text>{item.color}</Text>
{/* material tag*/}
{/* line*/}
<Text>{item.skeins}</Text>

           </View>
          
        </View>

    )
}

const styles = StyleSheet.create({
  thumbnailContainer:{
  width: 200,
  height: 200,
    justifyContent: 'center',
    backgroundColor: 'green',
    padding: 10
  },
  thumbnail:{
    width: 100,
    height: 100,
    backgroundColor: 'red'
  },
  detailsContainer:{
    backgroundColor: 'blue',
   
    
  }

  
});