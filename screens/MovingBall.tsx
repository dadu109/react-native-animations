import * as React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const {width, height} = Dimensions.get('window')
const { cond, eq, add, set, Value, event } = Animated;

const MovingBall = (): any => {
    const dragX = new Value(0);
    const dragY = new Value(0);
    const offsetX = new Value(width / 2);
    const offsetY = new Value(height / 2);
    const gestureState = new Value(-1);
    const onGestureEvent = event([
      {
        nativeEvent: {
          translationX: dragX,
          translationY: dragY,
          state: gestureState,
        },
      },
    ]);
    const transX = cond(
      eq(gestureState, State.ACTIVE),
      add(offsetX, dragX),
      set(offsetX, add(offsetX, dragX)),
    );
    const transY = cond(
      eq(gestureState, State.ACTIVE),
      add(offsetY, dragY),
      set(offsetY, add(offsetY, dragY)),
    );
    
    return (
    <View style={styles.container}>
        <PanGestureHandler
        maxPointers={1}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onGestureEvent}
        >
        <Animated.View
            style={[
            styles.box,
            {
                transform: [
                {
                    translateX: transX,
                },
                {
                    translateY: transY,
                },
                ],
            },
            ]}
        />
        </PanGestureHandler>
    </View>
    );
    
  }
  
  const CIRCLE_SIZE = 70;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    box: {
      backgroundColor: "tomato",
      marginLeft: -(CIRCLE_SIZE / 2),
      marginTop: -(CIRCLE_SIZE / 2),
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
      borderColor: "#000"
    },
  });

export default MovingBall;