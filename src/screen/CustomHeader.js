import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { jwtDecode } from "jwt-decode";
// import { decode as atob } from 'base-64';

const CustomHeader = () => {
  const navigation = useNavigation();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const register = () => {
    navigation.navigate('RegisterForm');
  };

  const login = () => {
    navigation.navigate('LoginForm');
  };

  const handleMenuClick = () => {
    setMenuVisible(!isMenuVisible);
    console.log(!isMenuVisible)
  };

  const handleLogout = async () => {
    // Elimina el token de acceso y realiza cualquier otra lógica de cierre de sesión necesaria
    await AsyncStorage.removeItem('accessToken');
    navigation.navigate('WelcomeSlide'); // Redirige al usuario a la pantalla de inicio de sesión
  };

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar el componente
    const checkAuthentication = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        setToken(true);
      }
    };

    checkAuthentication();
  }, []);

  // const accessToken = AsyncStorage.getItem('accessToken');

  // const checkAuthentication = async () => {
  //   const accessToken = await AsyncStorage.getItem('accessToken');
  //   if (accessToken) {
  //     // Si hay un token de acceso, redirigir al usuario al componente "Welcome"
  //     navigation.navigate('Welcome');
  //   }
  // };



  // useEffect(() => {
  //   const fetchUserRole = async () => {
  //     try {
  //       const accessToken = await AsyncStorage.getItem('accessToken');

  //       console.log(accessToken);

  //       if (accessToken) {
  //         const decodedToken = jwtDecode(accessToken);

  //         console.log(decodedToken);
  //         const role = decodedToken.role;

  //         console.log(role)
         
  //         if (role) {
  //           setUserRole(role);
  //         } else {
  //           console.warn('El token no contiene información sobre el rol del usuario.');
  //         }
  //        } else {
  //         console.warn('No se encontró el token de acceso en AsyncStorage.');
  //        }
  //     } catch (error) {
  //       console.error('Error al obtener el rol del usuario:', error);
  //     }
  //   };

  //   fetchUserRole();
  // }, []);




  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 100, backgroundColor: 'lightgray', justifyContent: "space-between" , padding: 20}}>
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={handleGoBack}>
                <AntDesign name="arrowleft" size={30} color="black" />
            </TouchableOpacity>
            <Text style={{ marginLeft: 10, fontSize: 25, fontWeight: 'bold'}}>SnapFaves</Text>
        </View>
        <View>
            <TouchableOpacity onPress={handleMenuClick}>
                <AntDesign name="menufold" size={30} color="black" />
            </TouchableOpacity>
        </View>
        <Modal isVisible={isMenuVisible}>
            <View style={{backgroundColor: 'white', borderRadius: 10, padding: 10}}>
                <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>Menú</Text>
                {!token && (
                  <TouchableOpacity onPress={register}>
                    <Text style={{fontSize: 18, marginBottom: 10}}>Registrarse</Text>
                  </TouchableOpacity>
                )}

                {!token && (
                  <TouchableOpacity onPress={login}>
                    <Text style={{fontSize: 18, marginBottom: 10}}>Iniciar sesión</Text>
                  </TouchableOpacity>
                )}

                {token && (
                  <TouchableOpacity onPress={handleLogout}>
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>Cerrar sesión</Text>
                  </TouchableOpacity>
                )}

                {/* <TouchableOpacity onPress={handleLogout}>
                    <Text style={{fontSize: 18, marginBottom: 10}}>Cerrar sesión</Text>
                </TouchableOpacity> */}
                {/* <Text style={{fontSize: 18, marginBottom: 10}}>Opción 2</Text>
                <Text style={{fontSize: 18, marginBottom: 10}}>Opción 3</Text> */}
                <TouchableOpacity style={{alignSelf: 'flex-end', marginTop: 20}} onPress={handleMenuClick}>
                    <Text style={{fontSize: 18, color: 'red'}}>Cerrar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    </View>
  );
};

export default CustomHeader;


