import { Text, View,ScrollView, StyleSheet } from "react-native";
import YarnThumbnail from "./YarnThumbnail";

interface Yarn{
  yarnName: string;
  brandName: string;
  color: string;
  weight: number;
  fiber: string;
  skeins: number;
 // image: string;
}

type BinThumbnailProps ={
    arr: Yarn[];
    label: string;
}
// takes in an array of yarns and a label for the bin
export default function BinThumbnail({arr, label} : BinThumbnailProps) {
  // show the first four yarn thumbnails in a flex grid
    return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <View style={styles.gridContainer}>
        {arr[0]&&  <YarnThumbnail {... arr[0]}/>  }
         {arr[1]&&  <YarnThumbnail {... arr[1]}/>  }
          {arr[2]&&  <YarnThumbnail {... arr[2]}/>  }
           {arr[3]&&  <YarnThumbnail {... arr[3]}/>  }
            {arr[4]&&  <YarnThumbnail {... arr[4]}/>  }
    

      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
 container:{
  width:'95%',
  padding: 5,
  backgroundColor: '#AECBEB',
 
 
 },
 gridContainer:{
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
     alignItems: 'center',
     justifyContent: 'center'
 },


  Text:{
    color:'#131c26'
  }
  
});