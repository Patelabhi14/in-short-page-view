import React from 'react'
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'

export default function Card({imgUrl}) {
  return (
    <TouchableWithoutFeedback style={styles.container} onPress={() => {console.log('clicked')}}>
      <View style={styles.container}>
        <Image source={{uri: imgUrl}} style={styles.img} />
        <Text style={styles.text}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img: {
    flex: 1,
    resizeMode: 'cover'
  },
  text: {
    fontSize: 18,
    padding: 20,
    color: 'white',
    backgroundColor: 'black'
  }
})