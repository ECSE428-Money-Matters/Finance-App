import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, TextInput, Button } from "react-native";

const SignUpPage = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
     // For now, we'll just log the entered details. In a real application, you'd handle account creation here.
    // console.log('Full Name:', fullName);
    // console.log('Email:', email);
    // console.log('Password:', password);
    const user = {
      fullName,
      email,
      password,
    }
    fetch('http://127.0.0.1:3000/register',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user),
    }).then(resopnse => response.json()).then(data => {
      console.log('Registration successful', data);
      navigation.navigate('SignIn');
    })
    .catch(error => {
      console.error('Registration failed', error);
    });
  };

  const handleSignInRedirect = () => {
    navigation.navigate('SignIn');
  };
  
  return (

    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MoneyMatters</Text>
      <Text style={styles.label}>Full Name:</Text>
      <TextInput 
        style={styles.input} 
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter your full name"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput 
        style={styles.input} 
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Text style={styles.label}>Password:</Text>
      <TextInput 
        style={styles.input} 
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry={true}
      />

      <Button title="Sign Up" onPress={handleSignUp} />

      <Text style={styles.linkText} onPress={handleSignInRedirect}>
        Already have an account? Sign In
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24, // Adjust the font size as needed
    textAlign: 'center',
    marginBottom: 20, // Adjust the margin as needed
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 15,
    borderRadius: 5,
  },
  linkText: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default SignUpPage;
