import { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Every shade is a valid CSS color keyword, so it can be used directly as
// backgroundColor in React Native and still passes isCssColor().

export type ColorFamily = {
  name: string;
  shades: string[]; // light -> dark
};

export const COLOR_FAMILIES: ColorFamily[] = [
  { name: 'Red',     shades: ['salmon', 'crimson', 'red', 'darkred'] },
  { name: 'Orange',  shades: ['lightsalmon', 'coral', 'orange', 'darkorange'] },
  { name: 'Yellow',  shades: ['khaki', 'gold', 'yellow', 'goldenrod'] },
  { name: 'Green',   shades: ['palegreen', 'limegreen', 'seagreen', 'darkgreen'] },
  { name: 'Teal',    shades: ['aquamarine', 'turquoise', 'teal', 'darkcyan'] },
  { name: 'Blue',    shades: ['lightskyblue', 'dodgerblue', 'royalblue', 'navy'] },
  { name: 'Purple',  shades: ['plum', 'mediumpurple', 'purple', 'indigo'] },
  { name: 'Pink',    shades: ['pink', 'hotpink', 'deeppink', 'palevioletred'] },
  { name: 'Brown',   shades: ['tan', 'peru', 'sienna', 'saddlebrown'] },
  { name: 'Cream',   shades: ['ivory', 'beige', 'bisque', 'wheat'] },
  { name: 'Neutral', shades: ['white', 'silver', 'gray', 'black'] },
];

// "Light Blue", "light-blue" and "lightblue" all count as "lightblue"
export function normalizeColor(input: string): string {
  return (input ?? '').toLowerCase().replace(/[\s-]/g, '');
}

const ALL_SHADES = new Set(COLOR_FAMILIES.flatMap(f => f.shades));

// true only if the value is one of the shades offered in the picker
export function isPickerColor(input: string): boolean {
  return ALL_SHADES.has(normalizeColor(input));
}

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  onBlur?: () => void;
  hasError?: boolean;
}

export default function ColorPicker({ value, onChange, onBlur, hasError }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // a scanned color like "Sage" isn't in the picker, so treat it as unset
  const selected = isPickerColor(value) ? normalizeColor(value) : '';

  function close() {
    setIsOpen(false);
    onBlur?.(); // marks the field as touched so validation can show
  }

  function handlePick(color: string) {
    onChange(color);
    close();
  }

  return (
    <>
      {/* the row shown in the form */}
      <Pressable
        onPress={() => setIsOpen(true)}
        style={[styles.field, hasError && styles.fieldError]}
      >
        <View style={[styles.previewDot, { backgroundColor: selected || 'transparent' }]} />
        <Text style={selected ? styles.fieldText : styles.placeholder}>
          {selected || 'Choose a color'}
        </Text>
      </Pressable>

      {/* the picker */}
      <Modal visible={isOpen} transparent animationType="slide" onRequestClose={close}>
        <Pressable style={styles.overlay} onPress={close}>
          <SafeAreaView style={styles.sheet}>
            {/* stops taps inside the sheet from closing it */}
            <Pressable onPress={() => {}}>
              <Text style={styles.title}>Yarn Color</Text>
              <Text style={styles.selectedName}>{selected || 'Nothing selected'}</Text>

              <ScrollView style={styles.scroll}>
                {COLOR_FAMILIES.map(family => (
                  <View key={family.name} style={styles.familyRow}>
                    <Text style={styles.familyName}>{family.name}</Text>
                    <View style={styles.shadeRow}>
                      {family.shades.map(shade => (
                        <Pressable
                          key={shade}
                          onPress={() => handlePick(shade)}
                          style={[
                            styles.swatch,
                            { backgroundColor: shade },
                            selected === shade && styles.swatchSelected,
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </Pressable>
          </SafeAreaView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    height: 50,
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 16,
  },
  fieldError: { borderColor: '#C0392B' },
  fieldText: { color: '#333333' },
  placeholder: { color: '#999999' },
  previewDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginRight: 10,
  },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  title: { fontSize: 18, fontWeight: '600' },
  selectedName: { color: '#666666', marginTop: 4, marginBottom: 12 },
  scroll: { flexGrow: 0 },
  familyRow: { marginBottom: 14 },
  familyName: { fontSize: 12, color: '#666666', marginBottom: 6 },
  shadeRow: { flexDirection: 'row', gap: 12 },
  swatch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: '#5B8C5A',
  },
});