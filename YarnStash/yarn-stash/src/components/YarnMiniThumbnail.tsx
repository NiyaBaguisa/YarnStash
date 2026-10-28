// this is where the boxes for the yarn is made and then the bins and the horizontal scroll bars will just take in this component
import { useColorScheme, View,Image,  StyleSheet } from "react-native";
import { colors } from "@/colors";
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
 const systemTheme =useColorScheme();
  const theme = systemTheme === "dark"? "dark": 'light';
   const activeColors = colors[theme];
   
  const weights: string[] = ['Lace', 'Super Fine', 'Fine', 'Light', 'Medium', 'Bulky', 'Super Bulky', 'Jumbo'];
  const weightDisplay = `${item.weight} ${weights.indexOf(item.weight)}`
    return(
        <View style={[styles.thumbnailContainer, {backgroundColor: activeColors.bg}]}>
        
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