import { useState } from 'react';

import { TextInput, View } from 'react-native';
import type { ColorFormatsObject } from 'reanimated-color-picker';
import ColorPicker, { LuminanceSlider, OpacitySlider, Panel3, colorKit } from 'reanimated-color-picker';

type ColorPickProps = {
  color: string;
  onColorPick: (newColor: string) => void;
}

const ColorPick = ({ color, onColorPick }: ColorPickProps) => {
  const [resultColor, setResultColor] = useState(color.toLowerCase());
  const [colorString, setColorString] = useState(color.toLowerCase());
  
  const handleColorPick = (color: ColorFormatsObject) => {
    onColorPick(color.hex);
    setResultColor(color.hex);
    setColorString(color.hex);
  };

  const handleEditColorString = (newColor: string) => {
    setColorString(newColor);
    const format = colorKit.getFormat(newColor);

    if (format === 'hex' as string) {
      setResultColor(newColor);
    } else if (format !== null) {
      setResultColor(colorKit.HEX(newColor));
    }
  }

  return (
    <View className="w-3/4 self-center">
      <ColorPicker
        value={resultColor}
        sliderThickness={25}
        thumbShape='circle'
        thumbSize={25}
        onCompleteJS={handleColorPick}
        adaptSpectrum
        style={{ gap: 15 }}
      >
        <View className="flex-row self-center gap-2">
          <TextInput
            className={`rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-center font-medium`}
            onChangeText={handleEditColorString}
            value={colorString}
            autoCapitalize="none"
          />
          <View
            className="rounded-lg w-10 h-10"
            style={{ backgroundColor: `${resultColor}` }}
          >
          </View>
        </View>
        <Panel3 centerChannel='hsl-saturation' />
        <LuminanceSlider />
        <OpacitySlider />
      </ColorPicker>
    </View>
  );
}

export default ColorPick;
