import {Tabs} from 'expo-router';
import {SQLiteProvider} from 'expo-sqlite';

export default function TabLayout(){

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
            
            <Tabs screenOptions={{headerShown:false}}>
    <Tabs.Screen name="index" options={{title: 'Home'}}/>
      <Tabs.Screen name="addYarn" options={{title: 'Add Yarn'}}/>
  </Tabs>

        </SQLiteProvider>
        

    );
}
