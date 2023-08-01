import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import Card from './Card';

const {height} = Dimensions.get('screen');
const SCREEN_HEIGHT = Dimensions.get('window').height;
const INPUT_RANGE = [-height, 0, height];

const getScaleStyles = (responder) =>
  responder.y.interpolate({
    inputRange: INPUT_RANGE,
    outputRange: [1, 0.9, 1],
  });

const getTranslateYStyles = (responder) => 
  responder.y.interpolate({
    inputRange: INPUT_RANGE,
    outputRange: [0, 40, 0],
  });

export default function Swiper({data}) {
  const [currIndex, setCurrIndex] = useState(0);

  const pan = useRef(new Animated.ValueXY()).current;
  const swipeCardPosition = useRef(
    new Animated.ValueXY({
      x: 0,
      y: -SCREEN_HEIGHT - Constants.statusBarHeight,
    }),
  ).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (
        (gestureState.dy > 0 && currIndex === 0) ||
        (gestureState.dy < 0 && currIndex === data.length - 1)
      )
        return pan.setValue({
          y: 0,
          x: 0,
        });

      if (gestureState.dy > 0 && currIndex > 0) {
        swipeCardPosition.setValue({
          x: 0,
          y: -SCREEN_HEIGHT - Constants.statusBarHeight + gestureState.dy,
        });
      } else {
        pan.setValue({
          y: gestureState.dy,
          x: 0,
        });
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (currIndex > 0 && gestureState.dy > 50 && gestureState.vy > 0.7) {
        Animated.timing(swipeCardPosition, {
          toValue: {x: 0, y: 0},
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setCurrIndex((prev) => prev - 1);
          swipeCardPosition.setValue({
            x: 0,
            y: -SCREEN_HEIGHT - Constants.statusBarHeight,
          });
        });
      } else if (
        currIndex < data.length - 1 &&
        -gestureState.dy > 50 &&
        -gestureState.vy > 0.7
      ) {
        Animated.timing(pan, {
          toValue: {x: 0, y: -SCREEN_HEIGHT - Constants.statusBarHeight},
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setCurrIndex((prev) => prev + 1);
          pan.setValue({x: 0, y: 0});
        });
      } else {
        Animated.parallel([
          Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: true,
          }),
          Animated.spring(swipeCardPosition, {
            toValue: {x: 0, y: -SCREEN_HEIGHT - Constants.statusBarHeight},
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
  });

  const nextCardScale = getScaleStyles(pan);

  const nextCardTranslateY = getTranslateYStyles(pan);

  const currentCardScale = getScaleStyles(swipeCardPosition);

  const currentCardTranslateY = getTranslateYStyles(swipeCardPosition);

  return (
    <View style={{flex: 1}}>
      {data
        ?.map((news, index) => {
          if (index === currIndex - 1) {
            return (
              <Animated.View
                key={index}
                {...panResponder.panHandlers}
                style={[
                  styles.container,
                  {
                    transform: [
                      {translateX: swipeCardPosition.x},
                      {translateY: swipeCardPosition.y},
                    ],
                  },
                ]}
              >
                <Card imgUrl={news} />
              </Animated.View>
            );
          }
          if (index < currIndex) return null;
          if (index === currIndex) {
            return (
              <Animated.View
                key={index}
                {...panResponder.panHandlers}
                style={[
                  styles.container,
                  {
                    transform: [
                      {translateX: pan.x},
                      {translateY: pan.y},
                      {scale: currentCardScale},
                      {translateY: currentCardTranslateY},
                    ],
                  },
                ]}
              >
                <Card imgUrl={news} />
              </Animated.View>
            );
          }
          if (index === currIndex + 1) {
            return (
              <Animated.View
                key={index}
                style={[
                  styles.container,
                  {
                    transform: [
                      {scale: nextCardScale},
                      {translateY: nextCardTranslateY},
                    ],
                  },
                ]}
              >
                <Card imgUrl={news} />
              </Animated.View>
            );
          }
        })
        .reverse()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
});
