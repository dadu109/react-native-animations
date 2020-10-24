import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, StyleSheet, Button } from 'react-native';
import {RootStackParamList} from '../navigation'

type HomeNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
    navigation: HomeNavigationProp;
};

const Home = ({ navigation }: Props) => {
    return (
        <View style={styles.container}>
            <Button title="Go to MovingBall" onPress={() => {navigation.navigate('MovingBall')}} />
            <Button title="Go to SpringBall" onPress={() => {navigation.navigate('SpringBall')}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Home;