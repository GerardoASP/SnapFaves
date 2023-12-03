import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import WelcomeSlide from './src/screen/WelcomeSlide';
import Posts from './src/screen/Posts';
import Videos from './src/screen/Videos';
// import 'expo-dev-client'

const Stack = createStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeSlide">
        <Stack.Screen name = "WelcomeSlide" component={WelcomeSlide} options={{ headerShown: false }}/>
        <Stack.Screen name = "Posts" component={Posts}/>
        <Stack.Screen name = "Videos" component={Videos}/>
      </Stack.Navigator>
    </NavigationContainer>
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
