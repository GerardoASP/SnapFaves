import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useWindowDimensions, Dimensions, Linking, Image} from 'react-native';
import { useFonts } from 'expo-font';
import React, { useEffect, useState, useRef } from 'react';
// import Svg, { Path } from 'react-native-svg';
import { Video, ResizeMode } from 'expo-av';
import { Button } from 'react-native-paper';

// const fontScale = c

export default function Videos() {
  const [isReady, setIsReady] = useState(false)
  const video = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
  
      <View>

        <View>
        <View>
          <Video
            ref={video}
            style={{width: 500, height: 300}}
            source={{ uri: "https://vjs.zencdn.net/v/oceans.mp4" }}
            // style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            onPlaybackStatusUpdate={setStatus}
          />
        </View>
        <View style={styles.buttons}>
          <Button title='Play from 5s' onPress={()=>video.current.playFromPositionAsync(5000)}/>
          <Button title={status.isLooping ? "Set to not loop" : "Set to loop"} onPress={() => video.current.setIsLoopingAsync(!status.isLooping)} />
        </View>
        </View>
      </View>
      

    </View>
  );
}

const styles = StyleSheet.create({
    principal_text: {
      color: '#000000',
      textAlign: 'center',
      fontSize: 36,
      left: 76,
      top: 130,
      position: 'absolute',
      width: 262,
    },
    principal_image:{
      height:220,
      width:220,
      left:91,
      top:280,
      position: 'absolute',
      borderRadius:120
    },
    simple_text:{
      color: '#000000',
      justifyContent: 'center',
      width: 262,
    },
    video:{
      flex: 1,
      alignSelf:"cover"
    },
    container:{
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    }
});