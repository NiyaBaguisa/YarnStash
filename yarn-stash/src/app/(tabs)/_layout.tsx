import { Tabs, useRouter } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { View, Alert, Modal, TouchableOpacity, Text, StyleSheet, Pressable, TextInput} from 'react-native';
import { useState, useEffect, use } from 'react';

interface Yarn{
  id: number;
  binId: number;
  image: any;
  yarnName: string;
  brandName: string;
  color: string;
  colorway: string;
  weight: number;
  fiber: string;
  skeins: string;
};



export default function TabLayout() {


  const router = useRouter();


  return (
    <>
    <SQLiteProvider
      databaseName="inventory.db"
      //create table
     
      onInit={async (db) => {
         // wipe the old table entirely — we're changing bin's type, not just its name
 //await db.execAsync(`DROP TABLE IF EXISTS master;`);
  

        await db.execAsync(`
                CREATE TABLE IF NOT EXISTS master (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                binId INTEGER REFERENCES bins(id),
                image TEXT DEFAULT '',
                yarnName TEXT NOT NULL,
                brandName TEXT NOT NULL,
                color TEXT NOT NULL,
                colorWay TEXT DEFAULT '',
                weight INTEGER NOT NULL,
                fiber TEXT NOT NULL,
                skeins INTEGER NOT NULL
                );
                PRAGMA journal_mode =WAL;`
        )
          type ColumnInfo = {
    cid: number;
    name: string;
    type: string;
    notnull: number;
    dflt_value: string | null;
    pk: number;
  };

  const columns = await db.getAllAsync<ColumnInfo>(`PRAGMA table_info(master);`);
  const existingNames = new Set(columns.map((col) => col.name));

  // note: SQLite requires a DEFAULT when adding a NOT NULL column to a
  // table that may already have rows, so these all specify one
  const requiredColumns: { name: string; ddl: string }[] = [
    { name: 'binId', ddl: `bin INTEGER DEFAULT 0` },
    { name: 'image', ddl: `image TEXT DEFAULT ''` },
    { name: 'color', ddl: `color TEXT DEFAULT ''` },
    { name: 'weight', ddl: `weight INTEGER DEFAULT 0` },
    { name: 'fiber', ddl: `fiber TEXT DEFAULT ''` },
    { name: 'skeins', ddl: `skeins INTEGER DEFAULT 0` },
  ];

  for (const col of requiredColumns) {
    if (!existingNames.has(col.name)) {
      await db.execAsync(`ALTER TABLE master ADD COLUMN ${col.ddl};`);
    }

  }
 
  //bins table 
   await db.execAsync(`
                CREATE TABLE IF NOT EXISTS bins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL UNIQUE
                );`)

                //log contents of bins and tables
      const tables = await db.getAllAsync(
    `SELECT * FROM master;`
  );
  console.log('Master Yarn List:', tables);

  const bins = await db.getAllAsync(`SELECT * FROM bins;`);
  console.log('Bins:', bins);
              }}
      
      //keep one stable connection
      options={{ useNewConnection: false }}>

      <Tabs screenOptions={{ headerShown: false}}>
        <Tabs.Screen 
        name="index" 
        options={{ title: 'Home' }} />



        <Tabs.Screen 
        name="addYarn" 
        options={{
          href: null, // Hides it from the tab menu
        }}/>

      <Tabs.Screen 
        name="upcscan" 
        options={{
          href: null, // Hides it from the tab menu
        }}/>
        
      

      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: (props) => (
            <TouchableOpacity
            style={styles.plusButton}
              onPress={()=> router.push('/(tabs)/addYarn')}
            >
              <Text>+</Text>
              </TouchableOpacity>
          ),
        }}
      />


      </Tabs>
 

    </SQLiteProvider>

    

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