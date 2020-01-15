import React, { Component } from 'react'
import axios from 'axios'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Button,
} from 'react-native'
import styles from '../styles/style'

//Main App
export default class Home extends Component {
  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FoundU{'\n'}</Text>
        <View style={{flexDirection: 'row'}}>
          <Button
            style={styles.send_button}
            onPress={() => navigate('SignIn')}
            title="Login"
          />
          <Text>{' \n'}</Text>
          <Button
            onPress={() => navigate('SignUp')}
            title="Sign Up"
          />
        </View>
      </View>
    );
  }
}
