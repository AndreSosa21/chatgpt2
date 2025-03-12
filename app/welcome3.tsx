import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export default function welcome3() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#353540', padding: 50 }}>
      
      
      <Image source={require('../assets/images/chatgpt2.png')} style={{ width: 50, height: 50, marginBottom: 30 }} resizeMode="contain" />

      
      <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 5 }}>Welcome to</Text>
      <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>ChatGPT</Text>

      {/* Subtítulo */}
      <Text style={{ color: '#A0A0A0', fontSize: 14, textAlign: 'center', marginBottom: 30 }}>
        Ask anything, get your answer
      </Text>
      {/* Subtítulo */}
      <Text style={{ color: '#A0A0A0', fontSize: 20, textAlign: 'center', marginBottom: 30 }}>
        Limitations
      </Text>

      {/* Caja de ejemplo */}
      <View style={{ width: '100%', backgroundColor: '#45475A', padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>"May occasionally generate incorrect information"</Text>
      </View>

      <View style={{ width: '100%', backgroundColor: '#45475A', padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>"May occasionally produce harmful instructions or biased conctent "</Text>
      </View>

      <View style={{ width: '100%', backgroundColor: '#45475A', padding: 15, borderRadius: 10, marginBottom: 30 }}>
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>"Limited knowledge of world and events after 2021"</Text>
      </View>

      {/* Indicadores de progreso */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
        <View style={{ width: 10, height: 5, backgroundColor: '#707070', borderRadius: 5, marginHorizontal: 3 }} />
        <View style={{ width: 10, height: 5, backgroundColor: '#707070', borderRadius: 5, marginHorizontal: 3 }} />
        <View style={{ width: 10, height: 5, backgroundColor: '#58A081', borderRadius: 5, marginHorizontal: 3 }} />
      </View>

      {/* Botón "Next" */}
      <TouchableOpacity 
      style={{ backgroundColor: '#58A081', width: '90%', padding: 15, borderRadius: 10, alignItems: 'center' }}
      onPress={() => router.push('/login')}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Let´s chat</Text>
        
      </TouchableOpacity>

    </View>
  );
}
