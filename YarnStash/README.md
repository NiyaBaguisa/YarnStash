# Yarn Stash – Inventory tracker for Fiber Artists
<img width="2240" height="1260" alt="Untitled design (2)" src="https://github.com/user-attachments/assets/7725c85e-50ce-4bff-98b0-398a737fd3a5" />

## Table of contents

- [Overview](#overview)
  - [Functional Requirements](#functional-requirements)
  - [Screenshots](#screenshots)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Acknowledgments](#acknowledgments)
- [Author](#author)


## Overview

### Functional Requirements

Users should be able to:

- Scan Barcodes of Yarn skeins and add them to their inventory
- Create custom yarn items if needed
- Organize yarn items into “bins” or groups based on the user’s needs
- Edit the number of yarn skeins in their inventory
- Remove bins
- Generate printable QR codes that when scanned show the contents of each bin
- Search yarn items in their inventory
- Filter yarn items by weight, color, material or brand
- View details of each yarn item at a glance 


### Screenshots
 Video Demo Light
 Video Demo Dark
 
<table>
  <tr>
    <th>Home Page</th>
  </tr>
  <tr>
    <td><img width="200" alt="Screen_Recording_20261102_161332_yarn-stash" src="https://github.com/user-attachments/assets/885137b5-e705-4314-88e6-9027068e5dd8" /></td>
  </tr>
</table>
<table>
  <tr>
    <th>Add New Yarn Form</th>
    <th>Form with Validation</th>
  <th>Dark Mode Form</th>
  </tr>
  <tr>
    <td><img width="200" alt="Add New Yarn Form" src="https://github.com/user-attachments/assets/77db2bdf-9f87-454d-a0b0-d7d266505e77" /></td>
    <td><img width="200" alt="Form with validation" src="https://github.com/user-attachments/assets/f21ffc89-5968-42ce-9e05-aa8b3fe00e9d" /></td>
    <td><img width="200" alt="Screen_Recording_20261031_144813_yarn-stash(1)(1)" src="https://github.com/user-attachments/assets/a218fbda-6add-4ce4-8426-9f349d1613e6" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th>Bins Page (Dark Mode)</th>
  </tr>
  <tr>
    <td><img width="300" alt="Bins Page (Dark Mode)" src="https://github.com/user-attachments/assets/281c70b5-a0aa-471f-bfcc-68c10f28c8d1" /></td>
  </tr>
</table>
### Links

- Download the App: [Add live site URL here](https://your-live-site-url.com)
- view Figma file: []
## My process

### Built with

- Typescript
- [Ravelry API](https://www.ravelry.com/api)
- [UPCode API](https://www.upcitemdb.com/api/explorer#!/lookup/get_trial_lookup)
-[SQLite](https://www.sqlitetutorial.net/)
- [React Hook Forms](https://react-hook-form.com/)
- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/) 
- [React Native](https://reactnative.dev/) 
-[Expo](https://expo.dev/) 
- [react-native-qrcode-svg](https://www.npmjs.com/package/react-native-qrcode-svg)


### What I learned

One feature that I am proud of within this application is the main barcode scan, api fetch, and form fill feature. This was my first time working with API endpoints and I am really glad that I added this feature because it makes adding store bought yarn easier as all of the fields in the form can be completed with just one scan using the phone’s camera. The API’s that I used do not encapsulate every ball of yarn available but it can handle some of the more popular brands of yarn in America.  Below is a brief snippet of the process of handling the barcode fetches. First I run the barcode number through a barcode database and then use the resulting item name to run it through a yarn database to get more details about the yarn item.

```tsx
// Use the name of the product from the upcscan to query same item in ravelry
async function fetchRavelry(query : string) {
 
  try {
   const response = await fetch(`https://api.ravelry.com/yarns/search.json?query=${encodeURIComponent(query)}&sort=best&page_size=10`, {
   // method: "GET",
    headers: {
      Authorization: `Basic ${encoded}`,
    },
  });


    if (!response.ok) {
      console.error(`Request failed: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error(errorBody);
      resetScan();
      return;
    }
// data  is a page of the results (object)
    const data = await response.json();
   
    console.log("query used for initial ravelry search: ", query )
  console.log("Success:", data);
   
   // store the best matches in an array
     let bestMatches : RavelrySearchResult[]=[];
// if there are no matches in the Ravelry API fill the form with known data from the UPCscan API

    if(bestMatches.length > 0){
      setTopMatches(bestMatches);

    }else if(bestMatches.length ==0 && upcItem){
      fillUPC(upcItem)

    }else{
      alert('There were 0 matches in our current database.')
      setIsVisible(false);
    setIsScanned(false);
    setCode("");
    setupcItem(undefined);
    setTopMatches([]);
    }

  } catch (e) {
    console.error("Error making Ravelry fetch request:", e);
    resetScan();
  }
}

// upcitedb api fetch using scanned barcode
async function fetchYarn(){
  if (!code) return;
 
  try{
    const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`);
    setIsLoading(true);
    //parse json
    const result = await response.json();
   
    const item = result.items?.[0];
        if (!item) {
      console.log("No product found for UPC:", code, result);
      Alert.alert("Not found", "That barcode isn't in the database. Try another or add it manually.");
      setIsScanned(false); // let the camera scan again
      setIsVisible(false);
   setIsLoading(false);
    setCode("");
    setupcItem(undefined);
    setTopMatches([]);
      return;
    }

    const scannedItem= {
      "binId": 0,
      "image": item.images[0]?? "",
      "yarnName": item.title,
  "brandName": item.brand,
  "color": item.color,
  "colorWay" : "",
  "weight": "0",
  "fiber": [],
  "skeins": "1",
    }
    setupcItem(scannedItem);  

  }  catch(e){
    console.log(e)
    resetScan();
  }
}

```

Another aspect of this application that I am really proud of is my application of conditional rendering for a couple of the pages in my app. For example on the “Bins” page, where the user can view their inventory groups, depending on if a user selects a bin or not, the page will either show all previews of all their bins, or the list of yarn within the selected bin. I was really happy that I was able to apply conditional rendering like this using my own thinking, without any help from an external resource. I felt that I was really beginning to understand how to render out UI using Typescript.

```tsx  
export default function Bins() {

    // keep track of screen state
    // null / falsy = show grid of bin thumbnails
    // truthy show selected bin
    const [isBinSelected, setIsBinSelected] = useState<boolean>(false);
    //state for selected bin
    const [pressedBin, setPressedBin] = useState <Bin>();
    //use state for list of bins
    const [binsList, setBinsList] = useState<Bin[]>([]);
  
    return(
        <SafeAreaView>
           {isBinSelected? <BinExpandedView pressedBin={pressedBin} setPressedBin={setPressedBin} isBinSelected={isBinSelected} setIsBinSelected={setIsBinSelected}/>: <BinsGridView data={binsList} pressedBin={pressedBin} setPressedBin={setPressedBin} onBinDeleted={loadBinList}/>} 
        </SafeAreaView>
        )}

```


### Continued development

This project was my first time being exposed to SQLite and it was something that I feel that I can understand quickly in concept, therefore I want to use more SQL / SQLite / data to drive more projects. I only learned the basics for this project but I would like to dig deeper into this technology in the future.

I also want to learn more about contexts in React. I realized towards the end of this project as I was approaching my deadline that contexts would have really cleaned up a lot of my logic, especially repetition of Ts interfaces between projects, and instances of prop drilling. As I have just been introduced to this concept of having globally available logic through contexts, when I have time again to work on this project, I would like to clean up those areas of code using context.


### Useful resources

- [Mastering useFocusEffect in React Native: Avoid pointless Re-Renders](https://medium.com/dev-stream/optimizing-screen-behavior-with-usefocuseffect-in-react-native-00e25ad6c4d9) - This article introduced me to the concept of useFocusEffect. I found using this pattern over using a regular UseEffect that fires on mount is better when creating applications.
- [How to Lift  State Up](https://www.youtube.com/watch?v=UaeQ-LWOFDg&t=24s) - This is a video that always helps me think through the lifting state if there is ever a time when I am having trouble.
- [🚀 Problem Statement: Chips Input in React | by Srinivas | Medium](https://medium.com/@Srinivas_N/problem-statement-chips-input-in-react-4b5510b8a0a9) - A great article and inspiration that was useful in creating the chips for the fiber input within my form.
- [The Android/Material Design Font Size Guidelines](https://www.learnui.design/blog/android-material-design-font-size-guidelines.html) - A helpful guide for mobile typeface design.
-  [Getting Started with SQLite Quickly](https://www.sqlitetutorial.net/sqlite-getting-started/) - Great site for beginners learning SQLite. I referenced these docs many times while working on this project.

### AI Collaboration
I used Claude for the following:
* Debugging
* Generation of regex parsing functions
* Form validation
* Color Input Styling within the form
* Converting my figma designs to a StyleSheet

What worked really well with Claude was anything that had to do with styling the app. I created what I wanted the app to look like in Figma and showed Claude the screenshots and it was really easy to add the stylesheet into the app. 

Debugging and the generation of the parsing functions was something that took a lot of prompting back and forth, because I was not looking for certain characters or symbols to parse through. For example one of the parsing functions should look through the string that the barcode search api returns and output only the colorway. Since colorway names are very abstract, for example Yuletide or Linen, there is no way that I could make a dictionary to look for any specific colorway so I had to do the opposite and strip away all of the irrelevant information that was easier to parse through until I was left with the colorway. It’s not perfect, but I am able to remove brand names using the brandName key from the barcode api, and also create a dictionary of yarn weights, as there are a limited number of them and use these in conjunction with cleaning up any numbers, symbols, and extra spaces to get a good enough result. Claude was able to create a function that reached this goal, but I still left a way for the user to edit the results because there are some instances where it cannot catch everything.

## Author

- Github - [@NiyaBaguisa](https://github.com/NiyaBaguisa)
- LinkedIn - [Niya Baguisa](https://www.linkedin.com/in/niyayates/)


## Acknowledgments

* Yarn by Corner Pixel from [Noun Project] (https://thenounproject.com/browse/icons/term/yarn)
* scan qr by Nursa from [Noun Project](https://thenounproject.com/browse/icons/term/scan-qr/)
* barcode scanner by Rohith M S from[Noun Project](https://thenounproject.com/browse/icons/term/barcode-scanner/)
* scan qr code by Hartan from [Noun Project](https://thenounproject.com/browse/icons/term/scan-qr-code/)
* scan qr code by Hartan from [Noun Project] (https://thenounproject.com/browse/icons/term/scan-qr-code/)
* Box by Dwi ridwanto from [Noun Project] (https://thenounproject.com/browse/icons/term/box/)


