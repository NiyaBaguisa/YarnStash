import { TextInput, View, ScrollView, Modal, Pressable, StyleSheet, Button, Text, Image, Alert, FlatList, ImageSourcePropType } from 'react-native';
import { useForm, SubmitHandler, Controller, } from "react-hook-form";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter, Tabs, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import ChipInput from '@/components/ChipInput';
import ColorPicker from '@/components/ColorPicker';
import { isPickerColor } from '@/components/ColorPicker';


type Inputs = {
  binId: number
  image: string
  yarnName: string
  brandName: string
  color: string
  colorWay: string
  weight: string
  fiber: string[]
  skeins: string

}

type Bin = {
  id: number;
  title: string;
}

type Weight = {
  id: number,
  name: string,
  image: ImageSourcePropType,
}
export interface ScannedYarnData {
  binId: number;
  image: string;
  yarnName: string;
  brandName: string;
  color: string;
  colorWay: string;
  weight: string;
  fiber: string[];
  skeins: string;
}
//error component
function FieldError({ message }: { message?: string }) {
  return message ? <Text style={styles.errorText}>{message}</Text> : null;
}

export default function AddYarn() {
  // arr of bin options
  const [binOptions, setBinOptions] = useState<Bin[]>([]);
  //use state for the bin dropdown
  const [selectedBin, setSelectedBin] = useState<Bin>();
  // state for visibiltity of new bin modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  //state for bin name user input
  const [inputBin, setInputBin] = useState('');
  //state for bin dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  // data for weight input
  const weights: Weight[] = [
    {
      id: 0,
      name: 'Lace',
      image: require('@/assets/images/weightImages/Weight-0-Lace.jpg'),
    },
    {
      id: 1,
      name: 'Super Fine',
      image: require('@/assets/images/weightImages/Weight-1-SuperFine.jpg'),
    },
    {
      id: 2,
      name: 'Fine',
      image: require('@/assets/images/weightImages/Weight-2-Fine.jpg'),
    },
    {
      id: 3,
      name: 'Light',
      image: require('@/assets/images/weightImages/Weight-3-Light.jpg'),
    },
    {
      id: 4,
      name: 'Medium',
      image: require('@/assets/images/weightImages/Weight-4-Medium.jpg'),
    },
    {
      id: 5,
      name: 'Bulky',
      image: require('@/assets/images/weightImages/Weight-5-Bulky.jpg'),
    },
    {
      id: 6,
      name: 'Super Bulky',
      image: require('@/assets/images/weightImages/Weight-6-SuperBulky.jpg'),
    },
    {
      id: 7,
      name: 'Jumbo',
      image: require('@/assets/images/weightImages/Weight-7-Jumbo.jpg'),
    },
  ];
  //state for selected weight
  const [selectedWeight, setSelectedWeight] = useState<Weight>(weights[0]);
  //fiber arr chips created
  const [chips, setChips] = useState<string[]>([]);
  //use state for the image picker
  const [image, setImage] = useState<string>('');
  // camera variables
  const [permission, requestPermission] = useCameraPermissions();
  //empty form values
  const emptyForm: Inputs = {
    binId: 1, image: '', yarnName: '', brandName: '', color: '',
    colorWay: '', weight: '', fiber: [], skeins: '1',
  };
  const router = useRouter();
  //ck if the form is in edit or add mode
  // parameters inherited from topMatches
  const { scannedYarn, editId } = useLocalSearchParams<{ scannedYarn: string; editId?: string }>();
  // is the form in edit mode
  const isEditing = !!editId;
  //parse the scannedYarn JSON string
  const parsedScannedYarn = useMemo(() => {
    //scannedyarn is falsy return 
    if (!scannedYarn) { return; }
    try {
      return JSON.parse(scannedYarn) as ScannedYarnData;
    } catch (e) {
      console.error("Failed to parse scanned yarn params data", e);
    }
    //if the scanned yarn canot be parsed return empy form
    if (!parsedScannedYarn) {
      return emptyForm;
    }

  }, [scannedYarn]);

  const pickImage = async () => {
    //request user permission to access photo library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //if permission is NOT granted alert user that permission is needed
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media Library is required.');
      return;
    }

    //if permission granted launch the image library picker

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.5,
      allowsEditing: true
    });

    console.log(result);

    //if the user backs out of upload, cancel operation

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setValue('image', uri);
    }
  };

  const { reset, handleSubmit, control, setValue, register, trigger, formState: { errors }, } = useForm<Inputs>({ mode: 'onTouched' });
  //connect to db
  const db = useSQLiteContext();

  //load bin table
  const loadBinList = async () => {
    try {
      //select only unique values from bin table
      const results = await db.getAllAsync(`SELECT * FROM bins
                ORDER BY id DESC `);
      setBinOptions(results as Bin[])
      console.log("here are the unique values in the bins table: ", results)

    } catch (e) {
      console.log("error loading bin data", e)

    }

  };

  useEffect(() => {
    loadBinList();


  }, [])

  register('binId', { validate: v => Number(v) > 0 || 'Please choose a bin' });
  register('weight', { required: 'Please choose a yarn weight' });
  register('fiber', { validate: v => (v && v.length > 0) || 'Add at least one fiber' });
  //on bin title press, set that bin to selected bin
  function handleRItemPress(item: Bin) {
    setSelectedBin(item);
    setValue('binId', item.id, { shouldValidate: true })
    setIsDropdownVisible(false);

  }
  //this is how each bin in the bin options should be shown on the screen
  const rItem = ({ item }: { item: Bin }) => {
    //on bin title press, set that bin to selected bin
    return (
      <Pressable onPress={() => handleRItemPress(item)} style={styles.dropdownItem}>
        <Text>
          {item.title}
        </Text>
      </Pressable>

    )

  }

  //toggle the dropdown
  function toggleDropdown() {
    setIsDropdownVisible(prev => !prev);
  }

  //show the dropdown on dropdown preview button press
  function handleDropdown() {
    if (isDropdownVisible) {
      return (
        <Modal visible={isDropdownVisible} transparent>
          <Pressable
            style={styles.overlay}
            onPress={() => setIsDropdownVisible(false)}>
            <SafeAreaView style={styles.dropdownContainer}>
              <FlatList
                data={binOptions}
                renderItem={rItem}
                keyExtractor={(item) => item.id.toString()}
                ListFooterComponent={
                  <Pressable onPress={handleNewBinButtonPress}>
                    <Text>+ Add New Bin</Text>
                  </Pressable>
                } />

            </SafeAreaView>
          </Pressable>

        </Modal>
      )
    }
  }

  //handle add new bin button press 
  function handleNewBinButtonPress() {
    //show modal
    setIsModalVisible(true);
  }

  //add data to bin table
  const addNewBin = async () => {
    if (!inputBin.trim()) {
      Alert.alert('Bin name required')
      return;
    }
    try {
      const result = await db.runAsync('INSERT INTO bins (title) VALUES(?)', [inputBin]);
      console.log('a new bin named: ', inputBin, 'was added');
      //reload the bin list
      await loadBinList();

      // reset bin input
      setInputBin('')
      // close the add new bin modal
      setIsModalVisible(false);

    } catch (e) {
      console.log('error logging new bin into database', e)

    }

  }

  //handle press for selected weight
  function handleWeightPress(item: Weight) {
    setValue('weight', item.name, { shouldValidate: true });
    setSelectedWeight(item);


  }

  //custom weights input component
  function inputWeights() {
    return (
      <>
        {weights.map((item: Weight) =>
          <Pressable key={item.id} onPress={() => handleWeightPress(item)}>
            <Image
              source={item.image}
              style={[styles.weightImage, selectedWeight.id === item.id && styles.selectedWeightImage]} />
          </Pressable>
        )}
      </>

    )
  }


  //on submit log the data to thre console
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const values = [
      Number(data.binId), data.image || '', data.yarnName, data.brandName,
      data.color, data.colorWay, data.weight, JSON.stringify(data.fiber), Number(data.skeins),
    ];
    if (isEditing) {
      try {
        await db.runAsync(
          `UPDATE master
         SET binId = ?, image = ?, yarnName = ?, brandName = ?, color = ?,
             colorWay = ?, weight = ?, fiber = ?, skeins = ?
         WHERE id = ?`,
          [...values, Number(editId)]
        );
        //reset router\
        router.setParams({ editId: undefined, scannedYarn: undefined }); // so "add" is blank next time
        //go back to previous screen
        router.back();

      } catch (e) {
        console.log(`error making changes in database: `, e)
      }

    } else {
      try {
        await db.runAsync(
          //add data to master yarn table ADJUST BIN DATA
          'INSERT INTO master (binId, image, yarnName, brandName, color, colorWay, weight, fiber, skeins) VALUES (?,?,?,?,?,?,?,?,?)',
          values
        );
        //alert submitted
        Alert.alert('New yarn added to your inventory', '', [{ text: 'OK' }], {
          cancelable: true,
          onDismiss: () => console.log('Alert dismissed by outside tap'),
        });

        //clear form
        reset();

        // go home
        router.push(`/(tabs)/bins`)
      } catch (e) {
        console.log('error logging data into yarn database: ', e)
      }

    }


  };

  //import data from search params to form fields

  useEffect(() => {
    console.log("ADDYARN focused, context yarnName =", parsedScannedYarn?.yarnName || "Yarn Name");

    //weight conversion
    const scannedWeight = weights.find(
      (w) =>
        w.id === Number(parsedScannedYarn?.weight) ||
        w.name === parsedScannedYarn?.weight
    );

    // set the fiber chips 
    if (parsedScannedYarn) {
      setChips(parsedScannedYarn.fiber)

    }

    reset({
      binId: 0,
      image: parsedScannedYarn?.image,
      yarnName: parsedScannedYarn?.yarnName,
      brandName: parsedScannedYarn?.brandName,
      color: parsedScannedYarn?.color,
      colorWay: parsedScannedYarn?.colorWay,
      weight: scannedWeight?.name ?? '',
      fiber: parsedScannedYarn?.fiber,
      skeins: parsedScannedYarn?.skeins,
    })
    if (scannedWeight) {
      setSelectedWeight(scannedWeight)
    }
    setImage(parsedScannedYarn?.image ?? '');
  }, [parsedScannedYarn])

  useEffect(() => {
    setValue('fiber', chips, { shouldValidate: true });
    console.log("current fiber list: ", chips);
  }, [chips])

  if (!permission) {
    return <View />
  }

  // camera permissions not granted => ask for permission
  if (!permission.granted) {
    return (
      <View >
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Request permission" />
      </View>
    );
  }


  return (

    <SafeAreaView style={styles.screen}>
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          Alert.alert('modal has been closed.');
          setIsModalVisible(false);
        }}>
        <Pressable
          style={styles.overlay}
          onPress={() => setIsModalVisible(false)}>
          <SafeAreaView style={styles.modalContentContainer}>
            <Text style={[styles.label, styles.modalLabel]}>Please Input New Bin Name:</Text>

            <TextInput
              style={styles.input}
              placeholder="New Bin Name"
              placeholderTextColor="#999999"
              onChangeText={setInputBin}
              value={inputBin}
            />

            <Pressable
              onPress={addNewBin}
              style={({ pressed }) => [styles.button, styles.modalButton, pressed && styles.buttonPressed]}>
              <Text style={styles.buttonText}>Add Bin</Text>
            </Pressable>

          </SafeAreaView>
        </Pressable>

      </Modal>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Yarn</Text>
         <Pressable
          disabled={!permission?.granted}
          onPress={() => router.push('/upcscan')}
        >
          <Image
          style={styles.icon}
          source={require('../../../assets/images/icons/barcode-icon.png')}/>
        </Pressable>
      </View>
      

      <ScrollView contentContainerStyle ={styles.content}>
        <View style={styles.controllerGroup}>
            <Pressable
          onPress={toggleDropdown}
           style={[styles.input, styles.dropdownField, !!errors.binId && styles.inputError]}>
          {handleDropdown()}
          <Text style={[styles.dropdownText, !selectedBin && styles.placeholderText]}>{selectedBin && selectedBin.title || `Select Bin ▾`}</Text>

        </Pressable>
        <FieldError message={errors.binId?.message} />
        </View>

      

        <View style={styles.imageContainer}>
         
          {image ? <Image source={{ uri: image }} style={styles.image} /> : <Image source={require('../../../assets/images/default-img.png')} style={styles.image} />}
         <Pressable
          onPress={pickImage}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Choose a photo</Text>
        </Pressable>
        </View>

        <View style={styles.controllerGroup}>
          <Text style={styles.label}>Yarn Name</Text>
          <Controller
            control={control}
            rules={{
              required: 'Yarn name is required',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.yarnName && styles.inputError]}
                placeholder="Yarn name"
                placeholderTextColor="#999999"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}

              />
            )}
            name="yarnName"
          />
          <FieldError message={errors.yarnName?.message} />
        </View>

        <View style={styles.controllerGroup}>
          <Text style={styles.label}>Brand Name</Text>
          <Controller
            control={control}
            rules={{
              required: 'Brand name is required',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.brandName && styles.inputError]}
                placeholder="Brand name"
                placeholderTextColor="#999999"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="brandName"
          />
          <FieldError message={errors.brandName?.message} />
        </View>
        <View style={styles.controllerGroup}>
          <Text style={styles.label}>Yarn Color</Text>
          <Controller
            control={control}
            rules={{
              required: 'Color is required',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ColorPicker
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                hasError={!!errors.color}
              />
            )}
            name="color"
          />
          <FieldError message={errors.color?.message} />
        </View>

        <View style={styles.controllerGroup}>
          <Text style={styles.label}>Color Way</Text>
          <Controller
            control={control}
            rules={{
              required: 'Color way is required',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.colorWay && styles.inputError]}
                placeholder="color way"
                placeholderTextColor="#999999"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="colorWay"
          />
          <FieldError message={errors.colorWay?.message} />
        </View>

        <View style={styles.controllerGroup}>
          <Text style={styles.label}>Yarn Weight</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {inputWeights()}
          </View>

        </View>
        <FieldError message={errors.weight?.message} />
        <View style={styles.controllerGroup}>

          <ChipInput chips={chips} setChips={setChips} onBlur={() => trigger(`fiber`)} />
        </View>
        <FieldError message={errors.fiber?.message as string | undefined} />


        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="How many skeins or cakes"
              placeholderTextColor="#999999"
              inputMode='numeric'
              keyboardType='numeric'

              onChangeText={onChange}
              value={value}
            />
          )}
          name="skeins"
        />

  <Pressable
        onPress={handleSubmit(onSubmit)}
        style={({ pressed }) => [styles.button, styles.submitButton, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonText}>{isEditing ? "Save Changes" : "Add Yarn"}</Text>
      </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}
const INK = '#222222';
const BG = '#FFFFFF';
const FIELD_BORDER = '#D0D0D0';

const BUTTON_PRESSED = '#5B9FD3'; // blue pressed state from Figma
const ERROR = '#C0392B';
const FONT_REGULAR = 'Comfortaa_400Regular';
const FONT_BOLD = 'Comfortaa_700Bold';


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
 
  // ---- header ----
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: FONT_BOLD,
    color: INK,
  },
 
  // ---- fields ----
  controllerGroup:{
    width: '100%',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontFamily: FONT_REGULAR,
    color: INK,
    marginBottom: 4,
  },
  input: {
    backgroundColor: BG,
    color: INK,
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    height: 44,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: INK,
  },
  inputError: {
    borderColor: ERROR,
  },
  errorText: {
    color: ERROR,
    fontSize: 12,
    fontFamily: FONT_REGULAR,
    marginTop: 4,
    marginLeft: 4,
  },
 
  // ---- bin dropdown field ----
  dropdownField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: INK,
  },
  placeholderText: {
    color: '#999999',
  },
  boldText: {
    fontFamily: FONT_BOLD,
  },
 
  // ---- image preview ----
  imageContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  image:{
    width: 170,
    height: 170,
    borderRadius: 28,
    backgroundColor: '#EDEDED',
    marginBottom: 16,
    resizeMode: 'cover',
  },
 
  // ---- buttons (black, blue when pressed) ----
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
    backgroundColor: INK,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonPressed: {
    backgroundColor: BUTTON_PRESSED,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: FONT_BOLD,
  },
  submitButton: {
    minWidth: 180,
    marginTop: 12,
  },
 
  // ---- weights ----
  weightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  weightImage:{
    width: 60,
    height: 60,
    margin: 4,
    borderRadius: 6,
    opacity: 0.6,
  },
  selectedWeightImage: {
    borderWidth: 2,
    borderColor: INK,
    opacity: 1,
  },
 
  // ---- modals ----
  overlay:{
    width: '100%',
    height: '100%'
  },
  modalContentContainer: {
    backgroundColor: '#FFFFFF',
    margin: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalLabel: {
    marginBottom: 8,
  },
  modalButton: {
    marginTop: 12,
  },
  dropdownContainer:{
    backgroundColor: '#FFFFFF',
    marginTop: 80,
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    maxHeight: '70%',
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
    icon : {
width:30,
height: 30
  }
});