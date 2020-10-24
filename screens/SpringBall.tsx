import * as React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import Svg, {Line, Circle} from 'react-native-svg'

const AnimatedLine = Animated.createAnimatedComponent(Line);

const {width, height} = Dimensions.get('window')
const { cond, eq, add, set, Value, event, Clock, diff, divide, and, lessThan,stopClock, abs, startClock, multiply, greaterThan, sub, block, interpolate, Extrapolate } = Animated;
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

const SpringBall = (): any => {

    const gestureX = new Value(0);
    const gestureY = new Value(0);
    const state = new Value(-1);
    const transX = interaction(gestureX, state);
    const transY = interaction(gestureY, state);

    const lineX = interpolate(transX, {inputRange: [-width/2,width/2], outputRange: [0, width], extrapolate: Extrapolate.CLAMP})
    const lineY = interpolate(transY, {inputRange: [-height/2,height/2], outputRange: [0, height-CIRCLE_SIZE / 2], extrapolate: Extrapolate.CLAMP})

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
        <Svg style={styles.lineBox}>
          <AnimatedLine
            x1={width/2}
            y1={height/2}
            x2={lineX}
            y2={lineY}
            stroke="lightgrey"
            strokeWidth="1.5"
          />
        </Svg>
    </View>
    );
    
  }
  
  const CIRCLE_SIZE = 70;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent:'center',
      alignItems:'center',
      height
    },
    box: {
      backgroundColor: "lightgreen",
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
      zIndex:3
    },
    lineBox: {
      width,
      height,
      position:'absolute',
      top:0,
      left:0,
      zIndex:2
    }
  });

export default SpringBall;