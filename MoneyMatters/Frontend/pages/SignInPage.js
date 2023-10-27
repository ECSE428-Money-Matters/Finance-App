import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';

const SignInPage = ({ navigation }) => {  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const responseBody = await response.text();
      const message = JSON.parse(responseBody); // Parse the JSON response

      if (message === "Login successful") {
        // handle successful login, e.g., navigate to a dashboard
        navigation.navigate('Dashboard');  
      } else {
        // handle unsuccessful login, e.g., display an error message
        alert(message);  
      }
    } catch (error) {
      // handle error, e.g., network error or server error
      console.error("Error during sign in:", error);
      alert("Failed to connect to the server.");
    }
  };
  
  const handleSignUpRedirect = () => {   
    navigation.navigate('SignUp');
  };

  const handlePasswordRecoveryRedirect = () => {
    navigation.navigate('PasswordRecovery');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput 
        style={styles.input} 
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
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

      <Text style={styles.linkText} onPress={handlePasswordRecoveryRedirect}>
        Forgot Password?
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
