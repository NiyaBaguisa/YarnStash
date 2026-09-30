import { createContext, useContext } from "react";

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

//default form data:
export const defaultData: ScannedYarnData = {
  binId: 0,
  image: "",
  yarnName: "test",
  brandName: "",
  color: "",
  colorWay: "",
  weight: "Lace",
  fiber: [],
  skeins: "2",
};

type YarnContextType = {
  scannedYarnData: ScannedYarnData;
  updateScannedYarn: (patch: Partial<ScannedYarnData>) => void;
  resetScannedYarn: () => void;
};

export const YarnContext = createContext<YarnContextType | undefined>(undefined);

export function useScannedYarnDataContext(){
    const scannedYarnData = useContext(YarnContext);

    //check is ScannedYarnData is undefined
    if(scannedYarnData === undefined){
        //throw error
        throw new Error("useScannedYarnDataContext must be used with a YarnContext")

    }

    return scannedYarnData;
}