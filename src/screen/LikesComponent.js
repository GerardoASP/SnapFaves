import React, { useEffect, useState, useRef, useCallback } from 'react';
import { NativeModules, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal } from 'react-native';
import { View, FlatList, Button, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Paragraph, Title, TextInput, IconButton} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import axios from 'axios'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { jwtDecode } from "jwt-decode";
import * as Updates from 'expo-updates';
import { useRoute } from '@react-navigation/native';

const LikesComponent = () => {
    const [token, setToken] = useState(false);
    const [role, setRole] = useState(false);
    const [UsId, setUsId] = useState('');
    const route = useRoute();
    const navigation = useNavigation();
    const [selectedImageUris, setSelectedImageUris] = useState(null);
    const [selectedImageUri2, setSelectedImageUri2] = useState(null);
    const [showImageComp, setShowImageComp] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]);
    const [postsList, setPostsLists] = useState([])

    const likes = route.params.userStore.likes;
    const li = route.params.userStore
    // console.log(li);

    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState(null);


    const listsPosts = () => {

        axios.get(`http://192.168.0.19:3000/api/v1/posts`)
        .then((response) => {
            // console.log('Data posts: ', response.data)
            setPostsLists(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        listsPosts();
    }, [postsList])



    const filteredPosts = postsList.filter(item => likes.includes(item._id));
    

    return (
        <View style={{flex :1}}>
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center"}}>
                <Text style={{fontWeight: 'bold', fontSize: 24}}>Favoritos</Text>
            </View>
            {filteredPosts.length > 0 ? (
                <FlatList 
                data={filteredPosts} 
                keyExtractor={(item) => item._id}
                renderItem = {({item})=>(
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center", margin: 10}}>
                            <Card>
                                <Card.Content>
                                    <View style={{flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center"}}>
                                        <Title>{item.title}</Title>
                                    </View>
                                    <View style={{flex:0, justifyContent:"center", alignItems:"center"}}>
                                        <ScrollView horizontal={true} style={{width:200}}>
                                            {item.avatar.map((imageUrl, index) => {

                                                const key = `${index}-${imageUrl}`; // Crear una clave única
                                                // Obtener la extensión del archivo desde la URL
                                                const fileExtension = imageUrl.split('.').pop().toLowerCase();

                                                // Definir las extensiones que consideras como imágenes
                                                const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

                                                // Determinar si la URL apunta a una imagen o un video
                                                const isImage = imageExtensions.includes(fileExtension);

                                                // Renderizar la imagen o el componente de video según el resultado
                                                return isImage ? (
                                                    <Image
                                                        key={key}
                                                        source={{ uri: `http://192.168.0.19:3000/api/v1/uploads/${imageUrl}` }}
                                                        style={{ width: 200, height: 150, margin: 5 }}
                                                    />
                                                ) : (
                                                    <Video
                                                        key={key}
                                                        ref={video}
                                                        style={{width: 200, height: 150}}
                                                        source={{ uri: `http://192.168.0.19:3000/api/v1/uploads/${imageUrl}` }}
                                                        // style={styles.video}
                                                        useNativeControls
                                                        resizeMode={ResizeMode.CONTAIN}
                                                        isLooping
                                                        onPlaybackStatusUpdate={setStatus}
                                                    />
                                                );
                                            })}
                                        </ScrollView>
                                    </View>
                                    <Paragraph>Subtítulo: {item.subtitle}</Paragraph>
                                    <Paragraph>Descripción: {item.description}</Paragraph>
                                    <Paragraph>Activo: {item.active ? 'Sí' : 'No'}</Paragraph>
                                </Card.Content>
                            </Card>
                    </View>
                )}/>
            ):(
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center", margin: 10}}>
                    <Card>
                        <Card.Content>
                            <Text>No hay likes</Text>
                        </Card.Content>
                    </Card>
                </View>
            )}
        </View>
                                    
    )
}

export default LikesComponent