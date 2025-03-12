import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/authContext';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { handleLogin, signUp } = useContext(AuthContext)

  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' }}>
    <Image source={require('../assets/images/chatgpt2.png')} style={{ width: 50, height: 50, marginBottom: 30 }} resizeMode="contain" />
      <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 20 }}>Welcome back</Text>
      <View style={{ width: '90%', padding: 20, backgroundColor: '#333', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 }}>
        <Text style={{ fontSize: 14, color: '#aaa', marginBottom: 5 }}>Email address</Text>
        <TextInput
          style={{ width: '100%', padding: 10, marginBottom: 15, borderRadius: 5, backgroundColor: '#fff', color: '#000' }}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={{ fontSize: 14, color: '#aaa', marginBottom: 5 }}>Password</Text>
        <TextInput
          style={{ width: '100%', padding: 10, marginBottom: 15, borderRadius: 5, backgroundColor: '#fff', color: '#000' }}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        

        <TouchableOpacity style={{ backgroundColor: '#58A081', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 10 }} onPress={() => handleLogin(email, password)}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 10 }}>Don't have an account? <TouchableOpacity onPress={signUp} ><Text style={{ color: '#58A081' }}>Sign up</Text></TouchableOpacity></Text>
       
      </View>
    </View>
  );
}
