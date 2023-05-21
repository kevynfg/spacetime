import { StatusBar } from 'expo-status-bar';
import { Text, ImageBackground, View,TouchableOpacity } from 'react-native';

import blurBg from './src/assets/luz.png'
import Stripes from './src/assets/stripes.svg'
import Logo from './src/assets/logo.svg'

const StyledStripes = styled(Stripes);

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import {
  BaiJamjuree_700Bold
} from '@expo-google-fonts/bai-jamjuree'
import { styled } from "nativewind";

export default function App() {
  const [isFontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold
  })
  
  if (!isFontsLoaded) {
    return null;
  }

  return (
    <ImageBackground 
      source={blurBg} 
      className="bg-gray-900 relative flex-1 px-8 py-10" 
      imageStyle={{position: 'absolute', left: '-100%'}}>
      <Text className="font-title text-5xl text-gray-50">Rocketseat</Text>
      
      <StyledStripes className="absolute left-2" />

      <View className="flex-1 items-center justify-center gap-6">
        <Logo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">Sua cápsula do tempo</Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">Colecione momentos marcantes de sua jornada e compartilhe (se quiser)
            com o mundo!
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.7} className="rounded-full bg-green-500 px-5 py-2">
          <Text className="font-alt text-sm uppercase text-black">Cadastrar lembrança</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" translucent/>
    </ImageBackground>
  );
}
