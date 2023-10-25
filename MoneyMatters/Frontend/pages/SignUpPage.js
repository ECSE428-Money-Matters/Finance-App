import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, TextInput, Button } from "react-native";

const SignUpPage = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://10.121.223.144:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: fullName,
          username: email,   
          password: password
        })
      });
      const message = await response.text();
      if (message === "Login successful") {
        // handle successful login, e.g., navigate to a dashboard
        navigation.navigate('SignIn');  
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
