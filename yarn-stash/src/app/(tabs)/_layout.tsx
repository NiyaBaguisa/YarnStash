import { Tabs, useRouter } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { View, Alert, Pressable, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useState, useEffect } from 'react';



export default function TabLayout() {
  // keep track of visibility of add yarn and add bin menu 
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  useEffect(()=>{  console.log('isMenuVisible changed to: ', isMenuVisible)

  },[isMenuVisible])

  const router = useRouter();

const handlePress = () =>{
  setIsMenuVisible(prev=> !prev)

  

}


  return (
    <>
    <SQLiteProvider
      databaseName="inventory.db"
      //create table
      //TO DO: add default image for the photo option
      onInit={async (db) => {
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
      options={{ useNewConnection: false }}>

      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen 
        name="addYarn" 
        options={{
          href: null, // Hides it from the tab menu
        }} 
      />

      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: (props) => (
            <TouchableOpacity
            style={styles.plusButton}
              onPress={handlePress}
            >
              <Text>+</Text>
              </TouchableOpacity>
          ),
        }}
      />


      </Tabs>

    </SQLiteProvider>
    {
        isMenuVisible && (
          <View style={styles.menuContainer}>
             <TouchableOpacity
          style={styles.plusButton}
          onPress={()=> router.push('/(tabs)/addYarn')}>
            <Text>yarn form</Text>

      </TouchableOpacity>

       <TouchableOpacity
          style={styles.plusButton}
          onPress={()=> console.log("go to bin form")}>
            <Text>Bin form</Text>

      </TouchableOpacity>

          </View>


        )
      }

</>
  
    )
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
  menuContainer:{
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    zIndex: 999,
    elevation: 999,
    flexDirection: 'row',
    gap: 12,
  backgroundColor: 'rgba(0,0,0,0.1)',
  }

});