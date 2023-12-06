import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';

const WelcomeToSnapFaves = () => {
    const navigation = useNavigation();

    const goToPosts = () =>{
        navigation.navigate("Posts");
    }

    return (
        <View>
            <Text>WELCOME TO SNAPFAVES</Text>
            <TouchableOpacity onPress={() => {navigation.navigate("Posts")}} /* style={styles.text_button} */ style={{ borderRadius:5, shadowColor: '#000', alignItems: 'center', backgroundColor: '#4A90E2', padding: 10, textAlign:'center', fontWeight: 'bold'}}>
              <Text style={{ color: '#FFF', fontWeight: 'bold'}}>OK</Text>
            </TouchableOpacity>
        </View>
    )
}

export default WelcomeToSnapFaves