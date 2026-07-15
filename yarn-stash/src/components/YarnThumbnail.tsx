// this is where the boxes for the yarn is made and then the bins and the horizontal scroll bars will just take in this component
import { Text, View, StyleSheet } from "react-native";

interface Yarn{
  yarnName: string;
  brandName: string;
  color: string;
  weight: number;
  fiber: string;
  skeins: number;
 // image: string;
}
export default function YarnThumbnail(item: Yarn){
    return(
        <View style={styles.imageContainer}>
           {/* <img style={styles.thumbnail} src={item.image}/> */}
           <Text>{item.yarnName}</Text>
        </View>

    )
}

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#FFFFFF',
    justifyContent: "center",
    padding: 5,
    borderRadius: 20,
    margin: 5,
  },
  thumbnail:{
    width: 100,
    height: 100
  },

  
});