import React, { Component } from 'react';
import axios from 'axios';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  Button,
  AsyncStorage
} from 'react-native';
import { LoginStyle } from './../styles/style'

export default class SignIn extends Component {
  state = {
    username: null,
    password: null
  };

  onSubmit = e => {
    e.preventDefault()
    
    const { username, password } = this.state
    if (username && password) {
      axios.post(`${process.env.API}/users/login`, { username, password })
      .then(res => {
        const token = res.headers['auth']
        this._setStorage(token)
        this.props.navigation.navigate("Main")
      })
      .catch(e => console.log(e))
    }
  }

  _setStorage = (token) => {
    AsyncStorage.setItem('token', token)
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={LoginStyle.container}>
        <Text style={LoginStyle.welcome}>Login</Text>
        <TextInput style = {LoginStyle.input} 
          autoCapitalize="none" 
          onSubmitEditing={() => this.passwordInput.focus()} 
          autoCorrect={false} 
          keyboardType='email-address' 
          returnKeyType="next" 
          placeholder='Email or Mobile Num' 
          placeholderTextColor='rgba(225,225,225,0.7)'
          onChangeText={(username) => this.setState({username})}/>

        <TextInput style = {LoginStyle.input}   
          returnKeyType="go" 
          ref={(input)=> this.passwordInput = input} 
          placeholder='Password' 
          placeholderTextColor='rgba(225,225,225,0.7)' 
          secureTextEntry
          onChangeText={(password) => this.setState({password})}/>

        <TouchableOpacity style={LoginStyle.buttonContainer} 
          onPress={this.onSubmit}>
            <Text style={LoginStyle.buttonText}>Login</Text>
        </TouchableOpacity> 
      </View>
    );
  }
}
