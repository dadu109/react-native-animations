import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from '../screens/Home'
import MovingBall from '../screens/MovingBall'
import SpringBall from '../screens/SpringBall'

export type RootStackParamList = {
    Home: undefined;
    MovingBall: undefined;
    SpringBall: undefined;
};

const {Navigator, Screen} = createStackNavigator<RootStackParamList>();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Navigator>
                <Screen name="Home" component={Home} />
                <Screen name="MovingBall" component={MovingBall} />
                <Screen name="SpringBall" component={SpringBall} />
            </Navigator>
        </NavigationContainer>
    )
}

export default Navigation;