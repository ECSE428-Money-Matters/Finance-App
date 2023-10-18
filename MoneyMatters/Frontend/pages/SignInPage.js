import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';

const SignInPage = ({ navigation }) => {  // <-- Added navigation prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleSignUpRedirect = () => {   // <-- New function for redirecting
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
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

      <Button title="Sign In" onPress={handleSignIn} />

      <Text style={styles.linkText} onPress={handleSignUpRedirect}>   {/* <-- New "Sign Up" link */}
        Don't have an account? Sign Up
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
  linkText: {   // <-- New style for "Sign Up" link
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default SignInPage;
