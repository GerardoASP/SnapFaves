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


const InfoPosts = () => {
    const [token, setToken] = useState(false);
    const [role, setRole] = useState(false);
    const [UsId, setUsId] = useState('');
    const route = useRoute();
    const navigation = useNavigation();
    const [selectedImageUris, setSelectedImageUris] = useState(null);
    const [selectedImageUri2, setSelectedImageUri2] = useState(null);
    const [showImageComp, setShowImageComp] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]);

    const files = route.params.item.avatar;
    const post = route.params.item;

    const cantidadFiles = files.length;
    // console.log(cantidadFiles)

    // console.log(post);

    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState(null);

    // console.log(token);
    // console.log(role);
    // console.log(UsId);
    // console.log(post.author);


    const handleGoBack = () => {
        navigation.goBack();
        setModalVisible(false);
        // navigation.navigate('Posts');
        // Updates.fetchUpdateAsync();
    }

    const handleDeleteFile = async (postId, nameImage) => {
        try {
            const datos = {
                image: nameImage,
            };

            const response = await axios.put(`http://192.168.0.19:3000/api/v1/posts/${postId}/deleteImage`, datos);

            console.log('Respuesta de la solicitud PUT:', response.data);
            navigation.navigate('Posts');
        } catch (error) {
            // Manejar errores en caso de que la solicitud falle
            console.error('Error al realizar la solicitud PUT:', error);
        }

    }

    const handleImagePost = async () => {
        const images = selectedImageUris;

        console.log(images);

        let imageName = "";

        try {
            let formData = new FormData();

            const mime = require('mime');


            const fileType = mime.getType(images[0]);
            const fileNameParts = images[0].split('/');
            imageName = fileNameParts[fileNameParts.length - 1];

            formData.append('files', {
                uri: images[0],
                type: fileType, 
                name: imageName,
            });


            console.log("Uri---",images[0]);
            console.log("Type---",fileType);
            console.log("Name---",imageName);


            const response = await axios.post('http://192.168.0.19:3000/api/v1/posts/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }

            });
            console.log('Images uploaded successfully:', response.data);


            let miArray = response.data.fileDetails;

            console.log("Mi array antes", miArray);


            const datos = {
                image: miArray.name
            };
        
            const responseImage = await axios.put(`http://192.168.0.19:3000/api/v1/posts/${post._id}/updatePost`, datos);

            console.log('Respuesta de la solicitud PUT:', responseImage.data);

        }catch (error) {
            console.error('Error al crear la publicación o cargar la imagen en el backend:', error);

            setSelectedImageUris(null);
            setSelectedImageUri2(null);
        }
    };
    
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();


        if (status !== 'granted') {
            console.log('Permission to access media library denied');
            return;
        }

        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
    
        console.log(result);

        // if (selectedImages.length >= 5) {
        //     setSelectedImages(null);
        //     // Si ya se han seleccionado 5 archivos, no permitir más selecciones
        //     Alert.alert('El número máximo de archivos permitidos son 5.');
        //     return;
        // }
        
        if (!result.canceled) {
            setSelectedImages(result.assets);
            setSelectedImageUris(result.assets.map((images) => images.uri));
        }
    };



    useEffect(() => {
        const checkAuthentication = async () => {
          try {
            const accessToken = await AsyncStorage.getItem('accessToken');
      
            if (accessToken) {
              setToken(true);
            } else {
              setToken(false);
            }


          } catch (error) {
            console.error('Error al obtener el token:', error);
            // Manejar el error de manera apropiada, por ejemplo, redirigir a la página de inicio de sesión
          }
        };
      
        checkAuthentication();
    }, []);

    useEffect(() => {
        const getTokenName = async () => {
          try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            // console.log(accessToken);
      
            if (accessToken) {
              const decodedToken = jwtDecode(accessToken);
            //   console.log(decodedToken.userStore.name);
      
              if (decodedToken.userStore.role === "admin") {
                setRole(true);
              } else {
                setRole(false);
              }
            } else {
              console.log("No hay accessToken")
            }
          } catch (error) {
            console.error('Error al obtener o decodificar el token:', error);
          }
        };

        getTokenName();
    });

    useEffect(() => {
        const getUserId = async () => {
          try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            // console.log(accessToken);
      
            if (accessToken) {
              const decodedToken = jwtDecode(accessToken);
              setUsId(decodedToken.userStore._id);
            } else {
              console.log("No hay accessToken")
            }
          } catch (error) {
            console.error('Error al obtener o decodificar el token:', error);
            // Manejar el error de manera apropiada
          }
        };
      
        getUserId();
    }, []);







    const renderItem = ({ item }) => {

        const key = `${item}`;

        const fileExtension = item.split('.').pop().toLowerCase();

        // Definir las extensiones que consideras como imágenes
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

        // Determinar si la URL apunta a una imagen o un video
        const isImage = imageExtensions.includes(fileExtension);

        return isImage ? (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center", margin: 10}}>
                <Card>
                    <Card.Content> 
                        <View style={{flex:0, justifyContent:"center", alignItems:"center"}}>
                            <Image
                                key={key}
                                source={{ uri: `http://192.168.0.19:3000/api/v1/uploads/${item}` }}
                                style={{ width: 200, height: 150, margin: 5 }}
                            />
                        </View>
                        {token && role && UsId === post.author && (
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    onPress={() => handleDeleteFile(post._id, item)}
                                    style={{ borderRadius: 10, shadowColor: '#000', alignItems: 'center', backgroundColor: '#ff4545', padding: 10, textAlign:'center', marginTop: 10, marginBottom: 3}}>
                                    <Icon name="trash" size={20} color="black"/>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Card.Content>
                </Card>
            </View>
        ) : (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center", margin: 10}}>
                <Card>
                    <Card.Content> 
                        <View style={{flex:0, justifyContent:"center", alignItems:"center"}}>
                            <Video
                                key={key}
                                ref={video}
                                style={{width: 200, height: 150}}
                                source={{ uri: `http://192.168.0.19:3000/api/v1/uploads/${item}` }}
                                // style={styles.video}
                                useNativeControls
                                resizeMode={ResizeMode.CONTAIN}
                                isLooping
                                onPlaybackStatusUpdate={setStatus}
                            />
                        </View>
                        {token && role && UsId === post.author && (
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    onPress={() => handleDeleteFile(post._id, item)}
                                    style={{ borderRadius: 10, shadowColor: '#000', alignItems: 'center', backgroundColor: '#ff4545', padding: 10, textAlign:'center', marginTop: 10, marginBottom: 3}}>
                                    <Icon name="trash" size={20} color="black"/>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Card.Content>
                </Card>
            </View>
        );
    };




  return (
    <View style={{flex :1}}>
        <View style={{flex:1, padding: 20, justifyContent: "center", alignItems:"center", alignContent:"center"}}>
            <Text style={{fontWeight: 'bold', fontSize: 24}}>Archivos</Text>
            <FlatList
                data={files}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        
            {cantidadFiles < 5 ? (
                <View>
                    {token && role && UsId === post.author && (
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={{ borderRadius: 10, shadowColor: '#000', alignItems: 'center', backgroundColor: '#4A90E2', padding: 10, textAlign:'center', marginTop: 10, marginBottom: 3}}>
                            <Icon name="plus" size={20} color="black"/>
                        </TouchableOpacity>
                    )}
                </View>
            ):(
                <View></View>
            )}
        </View>
        <Modal 
            visible={modalVisible} 
            onRequestClose={() => setModalVisible(false)}
            animationType="slide">
            
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 70, backgroundColor: 'lightgray', justifyContent: "space-between" , padding: 20}}>
                <View style={{ flexDirection: 'row'}}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <AntDesign name="arrowleft" size={30} color="black" />
                    </TouchableOpacity>
                    {/* <Text style={{ marginLeft: 10, fontSize: 25, fontWeight: 'bold'}}>EDU NATIVE</Text> */}
                </View>
            </View>

            <View style={styles.modalContainer}>
                <View style={styles.textInputContainer}>
                    <View style={{flex:0, justifyContent:"center", alignContent: "center", alignItems:"center"}}>
                        <Text style={{fontWeight: 'bold', fontSize: 24}}>AÑADE UN VIDEO O UNA FOTO </Text>
                    </View>
                    <View style={{height: 50}}></View>
                    <TouchableOpacity
                        onPress={pickImage}
                        style={{shadowColor: '#000', alignItems: 'center', backgroundColor: '#4A90E2', padding: 10, textAlign:'center', fontWeight: 'bold'}}
                    >
                        <Text style={{color: '#FFF', fontWeight: 'bold'}}>ESCOGE UN ARCHIVO</Text>
                    </TouchableOpacity>

                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={{ padding: 0, margin: 0 }}
                        style={{ padding: 0, margin: 0, width:300 }}
                    >
                        {selectedImages.map((image, index) => (
                            // <View>
                            //     <VideoPlayer
                            //         key={index}
                            //         source={{ uri: image.uri }}
                            //         style={{ width: 300, height: 200 }}
                            //     />
                            // </View>
                            <View>
                                {image.type == 'video' ? (
                                    // Renderizar un componente de video
                                    <View style={{justifyContent:'center', alignItems:'center'}}>
                                        <Video
                                            ref={video}
                                            style={{width: 300, height: 200}}
                                            source={{ uri: image.uri }}
                                            // style={styles.video}
                                            useNativeControls
                                            resizeMode={ResizeMode.CONTAIN}
                                            isLooping
                                            onPlaybackStatusUpdate={setStatus}
                                        />
                                    </View>
                                ) : (
                                    // Renderizar un componente de imagen
                                    <Image key={index} source={{ uri: image.uri }} style={{ width: 300, height: 200 }} />
                                )}
                            </View>
                        ))}

                    </ScrollView>



                        {/* <Button
                            title="Crear Post"
                            onPress={() => {
                                handleCreatePost();
                                setModalVisible(false);
                            }}
                        /> */}

                        
                            <View>
                                <TouchableOpacity 
                                    onPress={() => {
                                        handleImagePost();
                                        setModalVisible(false);
                                        navigation.navigate('Posts');
                                    }} 
                                    style={{shadowColor: '#000', alignItems: 'center', backgroundColor: '#4A90E2', padding: 10, textAlign:'center'}}>
                                    <Text style={{color: '#FFF', fontWeight: 'bold'}}>AGREGAR ARCHIVO</Text>
                                </TouchableOpacity>
                            </View>

                </View>
            </View>
        </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
    modalContainer:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    },
    text_button:{
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        textAlign:'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 16,
    },
    input: {
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
    },
    textInputContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        // alignItems: 'center',
        width: 300,
        margin:50
        
    },
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
    
})

export default InfoPosts