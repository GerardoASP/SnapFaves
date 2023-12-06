import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { Card, Paragraph, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'

const VerifyComponent = () => {
    const [usersList, setUsersLists] = useState([]);

    const listsUsers = () => {

        axios.get(`http://192.168.0.19:3000/api/v1/users`)
        .then((response) => {
            // console.log('Data posts: ', response.data)
            setUsersLists(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        listsUsers();
    }, [usersList])

    const handleUpdateUser = async (userId) => {
        try {
            const datos = {
                active: true, // O el valor que desees asignar a 'active'
            };
        
            const response = await axios.put(`http://192.168.0.19:3000/api/v1/users/${userId}/edit`, datos);

            console.log('Respuesta de la solicitud PUT:', response.data);
        } catch (error) {
            // Manejar errores en caso de que la solicitud falle
            console.error('Error al realizar la solicitud PUT:', error);
        }
    }



    return (
        <FlatList 
            data={usersList/* .filter(item => item.active) */} 
            keyExtractor={(item) => item._id}
            renderItem = {({item})=>(
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center", margin: 10}}>
                {/* <TouchableOpacity onPress={()=>navigation.navigate('InfoPosts')}> */}
                    <Card>
                        <Card.Content>

                            <View style={{flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center"}}>
                                <Title>{item.name} {item.lastname}</Title>
                            </View>
                            <View style={{flex:0, justifyContent:"center", alignItems:"center"}}>
                                
                            </View>
                            <Paragraph>Correo: {item.email}</Paragraph>

                            {/* <View style={{margin:10}}>
                                <Button title="Delete" onPress={() => handleDeletePost(item._id)}></Button>
                            </View> */}

                            {!item.active && (
                                <View>
                                    <TouchableOpacity
                                        onPress={() => handleUpdateUser(item._id)}
                                        style={{borderRadius: 10, shadowColor: '#000', alignItems: 'center', backgroundColor: '#0F9D58', padding: 10, textAlign:'center', marginTop: 10, marginBottom: 3}}>
                                        {/* <Text>VERIFICAR</Text> */}
                                        <Text style={{color: '#FFF', fontWeight: 'bold'}}>VERIFICAR</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Card.Content>
                    </Card>
                {/* </TouchableOpacity> */}
            </View>
        )}/>
    )
}

export default VerifyComponent