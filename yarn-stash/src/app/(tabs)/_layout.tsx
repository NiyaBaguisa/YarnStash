import {Tabs, useRouter} from 'expo-router';
import {SQLiteProvider} from 'expo-sqlite';
import {View, TouchableOpacity, Pressable, Text, StyleSheet} from 'react-native';
import {useState} from 'react';
import AddMenu from '@/components/AddMenu';


export default function TabLayout(){
// keep track of visibility of add yarn and add bin menu 
const [isMenuVisible, setIsMenuVisible] = useState(false);



    return(
        <SQLiteProvider 
        databaseName ="inventory.db"
        //create table
        //TO DO: add default image for the photo option
        onInit={async (db)=>{
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS master (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bin TEXT DEFAULT 'Default Bin',
                photo TEXT DEFAULT '',
                yarnName TEXT NOT NULL,
                brandName TEXT NOT NULL,
                color TEXT NOT NULL,
                weight INTEGER NOT NULL,
                fiber TEXT NOT NULL,
                skeins INTEGER NOT NULL
                );
                PRAGMA journal_mode =WAL;`

            )

        }}
        //keep one stable connection
        options ={{useNewConnection: false}}>
           
            <>
            <Tabs screenOptions={{headerShown:false}}>
    <Tabs.Screen name="index" options={{title: 'Home'}}/>
    
      
      <Tabs.Screen name="add" 
      options={{
     tabBarButton: (props)=>(
        <Pressable
      
        onPress={()=> setIsMenuVisible(true)}
        style={styles.plusButton}>
            <Text style={styles.plusIcon}>+</Text>
        </Pressable>
     )
        
      }}/>
      
       <Tabs.Screen name="bins" options={{title: 'My Bins'}}/>
       
  </Tabs>

    <AddMenu visible={isMenuVisible} onClose={() => setIsMenuVisible(false)}/>
        </>
        
        </SQLiteProvider>
        

    );
}



const styles = StyleSheet.create({
  plusButton: {
    width: 56,
    height: 56,
    
    backgroundColor: '#FF6FA5',
    justifyContent: 'center',
    alignItems: 'center',
    top: -12,
    alignSelf: 'center',
  },
  plusIcon: {
    color: 'white',
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 28,
  },
});