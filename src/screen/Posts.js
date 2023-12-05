import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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


const Posts = () => {
    const navigation = useNavigation();
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const [selectedImageUris, setSelectedImageUris] = useState(null);
    const [selectedImageUri2, setSelectedImageUri2] = useState(null);
    const [showImageComp, setShowImageComp] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImageUris2, setSelectedImageUris2] = useState([]);
    const [isReady, setIsReady] = useState(false)
    const video = useRef(null);
    const [status, setStatus] = useState({});

    // const [isState, setIsState] = useState(false);

    const [imageData, setImageData] = useState('');
    const [isMenuVisible, setMenuVisible] = React.useState(false);
    const [isChecked, setIsChecked] = useState(false);
    


    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleMenuClick = () => {
        setMenuVisible(!isMenuVisible);
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleLogout = async () => {
        // Elimina el token de acceso y realiza cualquier otra lógica de cierre de sesión necesaria
        await AsyncStorage.removeItem('accessToken');
        navigation.navigate('WelcomeSlide'); // Redirige al usuario a la pantalla de inicio de sesión
    };


    useEffect(() => {
        if (selectedImageUris) {
          setSelectedImageUri2(null);
        }
    }, [selectedImageUris]);

    useEffect(() => {
        if (selectedImageUri2) {
            setSelectedImageUris(null);
            setSelectedImageUri(null);
        }
    }, [selectedImageUri2]);

    const switchComponent = () => {
        setShowImageComp(!showImageComp);
    };


    const [postsList, setPostsLists] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [newPost, setNewPost] = useState({
        title: "",
        subtitle: "",
        description: "",
        avatar: "",
        active: isChecked
    });


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





    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();


        if (status !== 'granted') {
            console.log('Permission to access media library denied');
            return;
        }

        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
            multiple: true, // Permitir selección múltiple
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

    // const pickImage = async () => {
    //     const options = {
    //         title: 'Video Picker', 
    //         mediaType: 'video', 
    //         storageOptions:{
    //           skipBackup:true,
    //           path:'images'
    //         }
    //   };
      
    //     const result = await ImagePicker.launchImageLibraryAsync(options);
      
    //     if (!result.canceled) {
    //         // Procesar las imágenes o videos seleccionados aquí
    //         console.log('Imágenes o videos seleccionados:', result);
    //         setSelectedImages(result.assets);
    //         setSelectedImageUris(result.assets.map((images) => images.uri));
    //     }
    // };


    // const renderItem = ({ item }) => {
    //     return item.type === 'video' ? (
    //         <Video
    //             source={{ uri: item.uri }}
    //             style={{ width: 300, height: 200 }}
    //             resizeMode="contain"
    //         />
    //     ) : (
    //         <Image source={{ uri: item.uri }} style={{ width: 300, height: 200 }} />
    //     );
    //   };


    const handleCreatePost = async () => {
        // const image = selectedImageUri;
        const images = selectedImageUris;
        // const image2 = selectedImageUri2;
        // console.log('Imagen2 que llegó---------->',image2);
        console.log('Images1 que llegó---------->',images);
        let imagen = [];
        let imageName = "";
        let formDataImages = [];
        let arrayImages = [];
        // let imageUrl = "";
      
        try {
            let formData = new FormData();

            for (let i = 0; i < images.length; i++) {

                console.log('ojitoooo----', images[i])

                const mime = require('mime');

                const fileType = mime.getType(images[i]);
                const fileNameParts = images[i].split('/');
                imageName = fileNameParts[fileNameParts.length - 1];

                // formDataImages.push({
                //     uri: images[i],
                //     type: fileType, 
                //     name: imageName,
                // })

                if(fileType == "video/mp4"){
                    formData.append('files', {
                        uri: images[i],
                        type: fileType, 
                        name: imageName,
                    });
                }else{
                    formData.append('files', {
                        uri: images[i],
                        type: fileType, 
                        name: imageName,
                    });
                }

                // formData.append('images', {
                //     uri: images[i],
                //     type: fileType, 
                //     name: imageName,
                // });

                console.log("Uri---",images[i]);
                console.log("Type---",fileType);
                console.log("Name---",imageName);


                // formData.append('images', files[i]);
            }
            // console.log(formDataImages);

            // formData.append(`images`, formDataImages);
            console.log('FormDataMULTIPLE----', formData)

        

            const response = await axios.post('http://192.168.0.19:3000/api/v1/posts/upload-imageM', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }

            });
            console.log('Images uploaded successfully:', response.data);


            let miArray = response.data.filesM;

            console.log("Mi array antes", miArray);

            // function mantenerPosicionesImpares(array) {
            //     return array.filter((element, index) => index % 2 === 0);
            // }

            // miArray = mantenerPosicionesImpares(miArray);

            console.log("-------------------------------------------------------------");
            console.log("-------------------------------------------------------------");

            // console.log("Mi array después", miArray);

            const arrayImages = miArray.map(item => item.filename);
            console.log(arrayImages);

            // let miArray = response.data.filesM;


            // console.log("Mi array antes", miArray);


            // function mantenerPosicionesImpares(array) {
            //     return array.filter((element, index) => index % 2 === 0);
            // }
                
            // const arrayPosicionesImpares = mantenerPosicionesImpares(miArray);
                



            // console.log("-------------------------------------------------------------")
            // console.log("-------------------------------------------------------------")

            // console.log("Mi array después", miArray);
            // console.log(arrayPosicionesImpares);

            
            // for (let i = 0; i < miArray.length; i++) {
            //     arrayImages.push(miArray[i].filename);
            // }

        
            // console.log(arrayImages);

            newPost.avatar = arrayImages; // PASA NOMBRES ORIGINALES DE LAS FOTOS QUE ESTÁN GUARDADAS EN BACKEND
            console.log(isChecked);
            newPost.active = isChecked;
            console.log(newPost);
            
            // newPost.avatar = images; // PASA LAS URIS TEMPORALES DE LAS FOTOS EN EL CELULAR (NO ES LO IDEAL)
            
            // console.log(arrayImages)

            const postResponse = await axios.post("http://192.168.0.19:3000/api/v1/posts/new-post", newPost);
            console.log('Data new post', postResponse.data);
            // setSelectedImageUris(null);
            // setSelectedImageUri(null);
            // setSelectedImageUri2(null);




        //  newPost.avatar = selectedImageUri;

        //   const postResponse = await axios.post("http://192.168.0.19:3000/api/v1/posts/new-post", newPost);
        //   console.log('Data new post', postResponse.data);

        } catch (error) {
            console.error('Error al crear la publicación o cargar la imagen en el backend:', error);

            setSelectedImageUris(null);
            setSelectedImageUri(null);
            setSelectedImageUri2(null);
        }
    };

    const handleDeletePost = (postId) =>{
        console.log("postId", postId);
        const updatedPosts = postsList.filter((post) => post._id !== postId);
        setPostsLists(updatedPosts);
        axios.delete(`http://192.168.0.19:3000/api/v1/posts/${postId}`)
        .then((response) => {
            console.log('Post deleted', response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }



    return (
        <View style={{ flex: 1 }}>
            {/* <Video source={{ uri: "https://vjs.zencdn.net/v/oceans.mp4" }}/> */}
            <FlatList 
            data={postsList} 
            keyExtractor={(item) => item._id}
            renderItem = {({item})=>(
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center", margin: 10}}>
                    {/* <TouchableOpacity onPress={()=>navigation.navigate('InfoPosts')}> */}
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
                                {/* <View style={{margin:10}}>
                                    <Button title="Delete" onPress={() => handleDeletePost(item._id)}></Button>
                                </View> */}

                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity
                                            onPress={() => handleDeletePost(item._id)}
                                            style={{ borderRadius: 10, shadowColor: '#000', alignItems: 'center', backgroundColor: '#ff4545', padding: 10, textAlign:'center', marginTop: 10, marginBottom: 3}}>
                                            <Icon name="trash" size={20} color="black"/>
                                        </TouchableOpacity>
                                        {/* <Text>  </Text>
                                        <TouchableOpacity
                                            style={{borderRadius: 10, shadowColor: '#000', alignItems: 'center', backgroundColor: '#0F9D58', padding: 10, textAlign:'center', marginTop: 10, marginBottom: 3}}>
                                            <Icon name="info-circle" size={20} color="black"/>
                                        </TouchableOpacity> */}
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <TouchableOpacity
                                            style={{borderRadius: 10, shadowColor: '#000', alignItems: 'center', backgroundColor: '#4A90E2', padding: 10, textAlign:'center', marginTop: 10, marginBottom: 3}}>
                                            <Icon name="thumbs-up" size={20} color="black"/>
                                        </TouchableOpacity>
                                        <Text>  </Text>
                                        <TouchableOpacity
                                            style={{borderRadius: 10, shadowColor: '#000', alignItems: 'center', backgroundColor: '#F4B400', padding: 10, textAlign:'center', marginTop: 10, marginBottom: 3}}>
                                            <Icon name="star" size={20} color="black"/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    {/* </TouchableOpacity> */}
                </View>
            )}/>

            {/* <Button title="Nuevo Post" onPress={() => setModalVisible(true)}/> */}
            <View>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{shadowColor: '#000', alignItems: 'center', backgroundColor: '#4A90E2', padding: 10, textAlign:'center'}}>
                    <Text style={{color: '#FFF', fontWeight: 'bold'}}>NUEVO POST</Text>
                </TouchableOpacity>
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
                            <Text style={{fontWeight: 'bold', fontSize: 24}}>INFORMACIÓN DEL POST </Text>
                        </View>
                        <View style={{height: 50}}></View>
                        
                        <TextInput 
                            label="Título"
                            style={styles.input} 
                            onChangeText={(title_text) =>{
                                // console.log("Título publicación",title_text);
                                setNewPost({...newPost, title: title_text});
                            }}
                        />

                        <TextInput 
                            label="Subtítulo"
                            style={styles.input} 
                            onChangeText={(subtitle_text) =>{
                                // console.log("Subtítulo publicación",subtitle_text);
                                setNewPost({...newPost, subtitle: subtitle_text});
                            }}
                        />

                        <TextInput 
                            label="Descripción"
                            style={styles.input} 
                            onChangeText={(description_text) =>{
                                // console.log("Descripción publicación",description_text);
                                setNewPost({...newPost, description: description_text});
                            }}
                        />
                        <View style={{height: 10}}></View>

                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                value={isChecked}
                                onValueChange={handleCheckboxChange}
                            />
                            <Text style={styles.checkboxLabel}>¿Deseas hacer visible este post?</Text>
                        </View>
                        <View style={{height: 20}}></View>
                        

                        <View /* style={{height: 150}} */></View>
                        <TouchableOpacity
                            onPress={pickImage}
                            style={{shadowColor: '#000', alignItems: 'center', backgroundColor: '#4A90E2', padding: 10, textAlign:'center', fontWeight: 'bold'}}
                        >
                            <Text style={{color: '#FFF', fontWeight: 'bold'}}>ESCOGE UNA IMAGEN</Text>
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
                                        handleCreatePost();
                                        setModalVisible(false);
                                    }} 
                                    style={{shadowColor: '#000', alignItems: 'center', backgroundColor: '#4A90E2', padding: 10, textAlign:'center'}}>
                                    <Text style={{color: '#FFF', fontWeight: 'bold'}}>CREAR POST</Text>
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

export default Posts