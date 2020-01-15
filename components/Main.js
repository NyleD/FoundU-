import React, { Component } from 'react';
import axios from 'axios';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Button,
  TextInput,
} from 'react-native';

import styles from '../styles/style';
import Expo from "expo";
import direction from "../script/direction";


export default class Main extends Component {
  state = {
    username: null,
    location: {
      latitude: null,
      longitude: null
    },
    ourLocation: {
      latitude: null,
      longitude: null
    }
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({ ourLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }});
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  setUsername = e => {
    const username = e.target.value
    this.setState({ username })
  }

  playSound = async (degree) => {
    // distance(this.state, longitude, this.state.latitude, this.state)

    const soundObject = new Expo.Audio.Sound()
    try {
      const clock = 1;
      await soundObject.loadAsync(require(`./../assets/${clock}.m4a`))
      await soundObject.playAsync()

      return true
    } catch(e) {
      console.log(e)
    }
  }

  askForCoordinates = () => {
    const axios = require('axios')
      console.log(this.state)
      axios.get(`${process.env.API}/users/test/${this.state.username}/location`).then(res => {
        const location = res.data
        
        console.log(location)
        this.setState({location: {latitude: location.latitude, longitude: location.longitude}})
    
        //const degree = direction(this.state.location, this.state.ourLocation)
        // logic for getting for degrees
        //this.playSound(degree).then(result => console.log(result))
      })
      .catch (error => {
        console.log(error)
      })
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Help me find...</Text>

        <TextInput
          style={{height: 40}}
          onChangeText={username => this.setState({ username })}
          onChange={this.setUsername}
        />

        <Button
          style={styles.send_button}
          onPress={this.askForCoordinates}
          title="GO!"
        />

        <Text>latitude: {this.state.location.latitude}</Text>
        <Text>longitude: {this.state.location.longitude}</Text>
      </View>
    );
  }
}
