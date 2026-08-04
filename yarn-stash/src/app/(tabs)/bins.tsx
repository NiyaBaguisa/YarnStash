import { View, } from 'react-native';
import {useState, useEffect} from 'react';
import BinExpandedView from "@/components/BinExpandedView";
import BinsGridView from '@/components/BinsGridView';


export default function Bins() {

    // keep track of screen state
    // null / falsy = show grid of bin thumbnails
    // truthy show selected bin
    const [selectedBin, setSelectedBin] = useState(false);

//TO DO: bins expanded view should take in a prop of the title of the selected bin
    return(
        <View>
            {selectedBin? <BinExpandedView/>: <BinsGridView/>}
        
        </View>
    
        )
       
    
 
}