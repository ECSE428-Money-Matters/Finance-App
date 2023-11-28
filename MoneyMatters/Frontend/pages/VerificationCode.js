import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';

const Verification = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const { email } = route.params;

  const handleCode = async () => {
    try {
      const response = await fetch('http://10.0.0.124:3000/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          code: code
        })
      });

      const responseBody = await response.text();
      const message = JSON.parse(responseBody); // Parse the JSON response

      if (message.message === "Account created successfully!") {
        // handle successful login, e.g., navigate to a dashboard
        navigation.navigate('Dashboard', { email: email });
      } else {
        // handle unsuccessful login, e.g., display an error message
        alert(message);  
      }
    } catch (error) {
      // handle error, e.g., network error or server error
      console.error("Error during verification: ", error);
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
      <Text style={styles.label}>Code:</Text>
      <TextInput 
        style={styles.input} 
        value={code}
        onChangeText={setCode}
        placeholder="Enter your code"
        secureTextEntry={false}
      />

      <Button title="Verify" onPress={handleCode} />

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

export default Verification;