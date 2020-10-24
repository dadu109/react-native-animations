import * as React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const {width, height} = Dimensions.get('window')
const { cond, eq, add, set, Value, event, Clock, diff, divide, and, lessThan,stopClock, abs, startClock, multiply, greaterThan, sub, block } = Animated;
const EPS = 1e-3;
const EMPTY_FRAMES_THRESHOLDS = 5;

function spring(dt: any, position: any, velocity: any, anchor: any, mass = 1, tension = 400) {
    const dist = sub(position, anchor);
    const acc = divide(multiply(-1, tension, dist), mass);
    return set(velocity, add(velocity, multiply(dt, acc)));
}

function stopWhenNeeded(dt: any, position: any, velocity: any, clock: any) {
    const ds = diff(position);
    const noMovementFrames = new Value(0);
  
    return cond(
      lessThan(abs(ds), EPS),
      [
        set(noMovementFrames, add(noMovementFrames, 1)),
        cond(
          greaterThan(noMovementFrames, EMPTY_FRAMES_THRESHOLDS),
          stopClock(clock)
        ),
      ],
      set(noMovementFrames, 0)
    );
  }

function damping(dt: any, velocity: any, mass = 1, damping = 8) {
    const acc = divide(multiply(-1, damping, velocity), mass);
    return set(velocity, add(velocity, multiply(dt, acc)));
}

function interaction(gestureTranslation: any, gestureState: any) {
    const dragging = new Value(0);
    const start = new Value(0);
    const position = new Value(0);
    const anchor = new Value(0);
    const velocity = new Value(0);

    const clock = new Clock();
    const dt = divide(diff(clock), 1000);

    const step = cond(
        eq(gestureState, State.ACTIVE),
        [
        cond(dragging, 0, [set(dragging, 1), set(start, position)]),
        set(anchor, add(start, gestureTranslation)),

        // spring attached to pan gesture "anchor"
        spring(dt, position, velocity, anchor),
        damping(dt, velocity),
        ],
        [
        set(dragging, 0),
        startClock(clock),
        spring(dt, position, velocity, 0),
        damping(dt, velocity),
        ]
    );

    return block([
        step,
        set(position, add(position, multiply(velocity, dt))),
        stopWhenNeeded(dt, position, velocity, clock),
        position,
    ]);
}

const BouncingBall = (): any => {

    const gestureX = new Value(0);
    const gestureY = new Value(0);
    const state = new Value(-1);
    const transX = interaction(gestureX, state);
    const transY = interaction(gestureY, state);

    const onGestureEvent = event([
        {
          nativeEvent: {
            translationX: gestureX,
            translationY: gestureY,
            state: state,
          },
        },
    ]);

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
                transform: [{ 
                    translateX: transX,
                    translateY: transY 
                }],
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
      justifyContent:'center',
      alignItems:'center'
    },
    box: {
      backgroundColor: "lightgreen",
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
    },
  });

export default BouncingBall;