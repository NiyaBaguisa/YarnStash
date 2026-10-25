import { Text, View, StyleSheet, ScrollView, Image, Button, FlatList, TextInput, Pressable } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from "expo-sqlite";
import YarnThumbnail from "@/components/YarnThumbnail";
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated } from "react-native";
import QRScanner from "@/components/QRScanner";
import EmptyData from "@/components/Splash/EmptyData";

interface DBYarn {
  id: number;
  binId: number;
  image: string;
  yarnName: string;
  brandName: string;
  color: string;
  colorWay: string;
  weight: string;
  fiber: string;
  skeins: number;
};

type ColorRow = {
  color: string;
}
type BrandRow = {
  brandName: string;
}
type FiberRow = {
  fibers: string;
}
type WeightRow = {
  weight: string;
}
/*interface FilterChip{
name: string;
active : boolean
}
*/
export default function Index() {
  //yarn items data
  const [items, setItems] = useState<DBYarn[]>([])
  //conditional rendering , false for list view, true for yarn detailed view
  const [isYarnSelected, setIsYarnSelected] = useState<boolean>(false);
  //data for selected yarn held in this state
  const [selectedYarn, setSelectedYarn] = useState<DBYarn>();
  // searchbar text
  const [text, setText] = useState("");
  //loading
  
  const db = useSQLiteContext();
  //filtered items
  const [filteredItems, setFilteredItems] = useState<DBYarn[]>([])
  // fiber filter
  const [fiberFilters, setFiberFilters] = useState<string[]>([])
  // color filter
  const [colorFilters, setColorFilters] = useState<string[]>([])
  //brand filter
  const [brandFilters, setBrandFilters] = useState<string[]>([])
  //weight filter
  const [weightFilters, setWeightFilters] = useState<string[]>([])
  //active filters
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  //load in yarn database
  const loadData = async () => {
    try {
      //select only unique values from bin table
      const results = await db.getAllAsync(`SELECT * FROM master
                ORDER BY id DESC `);
      setItems(results as DBYarn[])
      console.log("Items Data: ", results)
      //filter data
      const cFilters = await db.getAllAsync<ColorRow>(`SELECT DISTINCT color FROM master`)
      setColorFilters(cFilters.map((row) => (row.color)))

      const bFilters = await db.getAllAsync<BrandRow>(`SELECT DISTINCT brandName FROM master`)
      setBrandFilters(bFilters.map((row) => (row.brandName)))

      const wFilters = await db.getAllAsync<WeightRow>(`SELECT DISTINCT weight FROM master`)
      setWeightFilters(wFilters.map((row) => (row.weight)))

      const fFilters = await db.getAllAsync<FiberRow>(`SELECT DISTINCT fiber FROM master`)
      console.log('fiber col values:', fFilters);
      // convert json string JSON.parse(jsonString);
      // add unique values to an array
      //map the values to chip objects
      //assign the objects to fiber filters

    } catch (e) {
      console.log("error loading bin data", e)

    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [db])
  );

  // toggle filter TO DO: FIX STATE MANAGEMENT 
  function toggleFilter(filter: string) {
    //filter.active = !filter.active;
    setActiveFilters(prev => prev.includes(filter) ? prev.filter(name => name !== filter) : [...prev, filter])
    console.log(filter, ": toggled")

  }


  // filter chips 
  function filterRenderItem(filterList: string[]) {
    return filterList.map(name => {
      const isActive = activeFilters.includes(name)
      return (
        <Pressable
          key={name}
          onPress={() => toggleFilter(name)}
          style={[styles.chip, isActive && styles.chipActive]}>
          <Text>{name}</Text>
        </Pressable>
      )
    })
  }

  useEffect(() => {
    // set filtered items based on text and if the new items also pass the chip filters
    let activeItems: DBYarn[] = [];
    //does item include text, yes, show
    const newItems = text ? (items.filter(item => item.yarnName.toLowerCase().includes(text.toLowerCase()) || item.brandName.toLowerCase().includes(text.toLowerCase()))) : items;
    //does item match filter? yes, show
    if (activeFilters.length > 0) {
      for (const item of newItems) {
        const hasMatch = Object.values(item).some(val => activeFilters.includes(val));
        if (hasMatch) {
          activeItems.push(item);
        };
      }
      setFilteredItems(activeItems);

    } else {
      setFilteredItems(newItems)
    }

    console.log("active filters: ", activeFilters)
  }, [text, activeFilters, items])

  //row of chips if any
  function filterRow(label: string, filterList: string[]) {
  if (filterList.length === 0) return null;
  return (
    <View style={styles.filterRow}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filterRenderItem(filterList)}
      </ScrollView>
    </View>
  )
}

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>

        <Text style={styles.title}>My Stash</Text>
        <Text style ={styles.subtitle}>{items.length} Skeins</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
             <TextInput
            style={styles.input}
            onChangeText={setText}
            value={text} 
            placeholder ="Search Stash..."/>
{/*search icon */}
          </View>
         <QRScanner/>

        </View>

        <View style={styles.filters}>
          {filterRow("Color:",colorFilters)}
          {filterRow("Brand:",brandFilters)}
          {filterRow("Weight:",weightFilters)}
          {/*add fibers*/}

        </View>

        
          <FlatList
          style={styles.list}
          ListEmptyComponent={<EmptyData />}
        showsVerticalScrollIndicator={false}
            data={filteredItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <YarnThumbnail item={item} isYarnSelected={isYarnSelected} setIsYarnSelected={setIsYarnSelected} selectedYarn={selectedYarn} setSelectedYarn={setSelectedYarn} onYarnDeleted={loadData} />} />
        
      </View>

    </SafeAreaView>

  );
}

const INK = "#222222";
const BG = "#FFFFFF";
const CHIP_BORDER = "#D0D0D0";
const CHIP_ACTIVE = "#00a0d6";
const FONT_REGULAR = "Comfortaa_400Regular";
const FONT_BOLD = "Comfortaa_700Bold";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
 
  // ---- header ----
  title: {
    fontSize: 28,
    fontFamily: FONT_BOLD,
    color: INK,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: FONT_REGULAR,
    color: INK,
    marginBottom: 16,
  },
 
  // ---- search ----
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderWidth: 2,
    borderColor: INK,
    borderRadius: 22,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: INK,
  },
 
  // ---- filters ----
  filters: {
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  filterLabel: {
    width: 64,
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: INK,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: INK,
    borderRadius: 8,
    backgroundColor: BG,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: CHIP_ACTIVE,
  },
  chipText: {
    fontSize: 12,
    fontFamily: FONT_BOLD,
    color: "#333333",
  },
 
  // ---- thumbnail list ----
  list: {
    flex: 1, // fills the space under the filters and scrolls on its own
  },
  listContent: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 24,
    gap: 14,
  },
});


