import { useEffect, useState } from "react";
import { FlatList, Text, View, ActivityIndicator,  } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

interface Yarn{
    id: number;
    bin: string;
    photo: string
  yarnName: string;
  brandName: string;
 color: string;
 weight: number;
  fiber: string;
 skeins: number;
 
}


export default function MasterList(){
    const [masterInventoryList, setMasterInventoryList] = useState<Yarn[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const db = useSQLiteContext();

    const loadInventory = async()=>{
        try{
            const results = await db.getAllAsync(`SELECT * FROM master
                ORDER BY id DESC `);
            setMasterInventoryList(results as Yarn[]);
        }catch(e){
            console.log("error loading data", e)
        }finally{
            setIsLoading(false);
        }
    };

    useEffect(()=>{
        loadInventory();

    }, [])

    if (isLoading){
        return <ActivityIndicator size="large" color="0000ff"/>
    }

    return(
        <FlatList
        data={masterInventoryList}
        keyExtractor={(item)=> item.id.toString()}
        renderItem={({item})=>(
            <View>
                <Text>{item.bin}</Text>
                <Text>{item.yarnName}</Text>
                <Text>{item.brandName}</Text>
                <Text>{item.color}</Text>
                <Text>{item.weight}</Text>
                <Text>{item.fiber}</Text>
                <Text>{item.skeins}</Text>
            </View>
        )}
        ListEmptyComponent={<Text>No items found</Text>}/>

    )
};