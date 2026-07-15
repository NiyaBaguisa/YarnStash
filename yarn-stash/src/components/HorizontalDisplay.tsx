import { Text, View,ScrollView, StyleSheet } from "react-native";
import YarnThumbnail from "./YarnThumbnail";
interface Yarn{
  name: string;
  brand: string;
  color: string;
  weight: number;
  material: string;
  skeins: number;
  image: string;
}
type HorizontalDisplayProps ={
    label: string;
    yarnData: Yarn[]; 
}
export default function HorizontalDisplay({
  label, yarnData}: HorizontalDisplayProps) {
  return (
    <View style={hStyles.container}>
      <Text>{label}</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
       {yarnData.map((item)=>
       
        <YarnThumbnail key={item.name}{...item}/>
        
       )}
      </ScrollView>
    </View>
  );
}

const hStyles = StyleSheet.create({
 container:{

  width:'100%',
  padding: 5,
 },

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
  Text:{
    color:'#131c26'
  }
  
});