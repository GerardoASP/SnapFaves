import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import WelcomeSlide from './src/screen/WelcomeSlide';
import Posts from './src/screen/Posts';
import Videos from './src/screen/Videos';
import RegisterForm from './src/screen/RegisterForm';
import LoginForm from './src/screen/LoginForm';
import CustomHeader from './src/screen/CustomHeader';
import PrivacyPolicies from './src/screen/PrivacyPolicies';
import WelcomeToSnapFaves from './src/screen/WelcomeToSnapFaves';
// import 'expo-dev-client'

const Stack = createStackNavigator();


import { decode, encode } from 'base-64';
import VerifyComponent from './src/screen/VerifyComponent';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeSlide">
        <Stack.Screen name = "WelcomeSlide" component={WelcomeSlide} options={{ headerShown: false }}/>
        <Stack.Screen name = "Posts" component={Posts} options={{ header: () => <CustomHeader/> }}/>
        <Stack.Screen name = "Videos" component={Videos}/>
        <Stack.Screen name = "RegisterForm" component={RegisterForm} options={{ headerShown: false }}/>
        <Stack.Screen name = "LoginForm" component={LoginForm} options={{ headerShown: false }}/>
        <Stack.Screen name = "CustomeHeader" component={CustomHeader}/>
        <Stack.Screen name = "PrivacyPolicies" component={PrivacyPolicies}/>
        <Stack.Screen name = "WelcomeToSnapFaves" component={WelcomeToSnapFaves} options={{ headerShown: false }}/>
        <Stack.Screen name = "VerifyComponent" component={VerifyComponent} options={{ header: () => <CustomHeader/> }}/>
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
