// import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, Switch, View} from 'react-native';
import { Image, TouchableOpacity } from 'react-native';
import { Card, IconButton, Icon, TextInput} from 'react-native-paper';
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const LoginForm = () => {
  const navigation = useNavigation();

  // const [firstname, setFirstname] = useState('');
  // const [lastname, setLastname] = useState('');
  // const [current_password, setCurrentPassword] = useState('');
  // const [email, setEmail] = useState('');
  // const [estaActivo, setEstaActivo] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar el componente
    const checkAuthentication = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        // Si hay un token de acceso, redirigir al usuario al componente "Welcome"
        navigation.navigate('Welcome');
      }
    };

    checkAuthentication();
  }, []);

  const [newUser, setNewUser] = useState({
    email: "",
    current_password: "",
  });

    const goToRegisterForm = () =>{
        navigation.navigate("RegisterForm");
    }

  const handleCancel = () => {
    navigation.navigate('WelcomeSlide');
  };

  // const handleLogin = async () => {
  //   try {
  //     console.log(newUser);
  //     const response = await axios.post("http://localhost:3000/api/v1/auth/login", newUser);
  //     const accessToken = response.data.accessToken;
  //     const refreshToken = response.data.refreshToken;
  //     console.log(accessToken);
  //     console.log(refreshToken);
  //     await AsyncStorage.setItem("accessToken", accessToken);
  //     Alert.alert(
  //       "Inicio de sesión exitoso",
  //       "¡Bienvenido! Por favor, inicia sesión para continuar."
  //     );
  //     navigation.navigate("Welcome");
  //   } catch (error) {
  //     console.error("Error de inicio de sesión:", error);
  //     Alert.alert(
  //       "Error",
  //       "Nombre de usuario o contraseña incorrectos. Por favor, inténtalo de nuevo."
  //     );
  //   }
  // };

  // const handleLogin = async () => {
  //   try {
  //     // Asegúrate de que newUser contenga las propiedades correctas
  //     const { email, current_password } = newUser;

  //     if (!email || !current_password) {
  //       Alert.alert("Error", "El email y la contraseña son obligatorios.");
  //       return;
  //     }

  //     // console.log(email);
  //     // console.log(current_password);
  //     console.log(newUser);

  //     // Realiza la solicitud al backend
  //     const response = await axios.post("http://192.168.0.19:3000/api/v1/auth/login", newUser);
  //     // const response = await axios.post("http://mantenimientoandino.co:3000/api/v1/auth/login", newUser);

  //     console.log(response.data)

  //     // Comprueba si la solicitud fue exitosa
  //     // if (response.status === 200) {
  //       const { accessToken, refreshToken } = response.data;


  //       //LOGIN PROFE
  //       // const accessToken = response.data.access;
  //       // await AsyncStorage.setItem("accessToken", accessToken);
  
  //       // Almacena los tokens de acceso y refresco
  //       await AsyncStorage.setItem("accessToken", accessToken);
  //       await AsyncStorage.setItem("refreshToken", refreshToken);
  

  //       // Almacena los tokens de acceso y refresco
  //       // await AsyncStorage.setItem("access", accessToken);
  //       // await AsyncStorage.setItem("refresh", refreshToken);

  //       // Redirige al usuario a la página de bienvenida
  //       navigation.navigate("Welcome");
  //       Alert.alert("Inicio de sesión exitoso", "¡Bienvenido! Por favor, dale OK para continuar.");
  //     //  } else {
  //     //   Alert.alert("Error", "Nombre de usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
  //     //  }
  //   } catch (error) {
  //     // console.error("Error de inicio de sesión:", error);
  //     Alert.alert("Error", "Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.");
  //     navigation.navigate("PresentationComponent");
  //   }
  // };

  const handleLogin = async () => {
    try {
      const { email, current_password } = newUser;
  
      if (!email || !current_password) {
        Alert.alert("Error", "El email y la contraseña son obligatorios.");
        return;
      }
  
      console.log(newUser);
  
      const response = await axios.post("http://192.168.0.19:3000/api/v1/auth/login", newUser);
  
      console.log(response.data);
  
      const { accessToken, refreshToken } = response.data;
  
      // Almacena los tokens de acceso y refresco
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
  
      navigation.navigate("Posts");
      Alert.alert("Inicio de sesión exitoso", "¡Bienvenido! Por favor, dale OK para continuar.");
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
  
      if (error.response) {
        // El servidor devolvió una respuesta con un código de estado que no es 2xx
        Alert.alert("Error", `Error del servidor: ${error.response.data.msg}`);
      } else if (error.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        Alert.alert("Error", "No se recibió respuesta del servidor. Por favor, inténtalo de nuevo.");
      } else {
        // Error al configurar la solicitud o durante la configuración
        Alert.alert("Error", "Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.");
      }
  
      navigation.navigate("WelcomeSlide");
    }
  };
  

  return (
    <View style={styles.container}>

      <Card style={styles.card}>
        {/* Agrega el IconButton en la esquina superior derecha */}
        <IconButton
          icon="close"
          size={24}
          onPress={goToRegisterForm}
          style={styles.closeButton}
        />

        <Text style={styles.header}>Iniciar sesión</Text>
        <View style={styles.imageContainer}>
          <Image source={{ uri: 'https://is2-ssl.mzstatic.com/image/thumb/Purple112/v4/57/56/40/575640d6-e8ca-a2c0-93d1-f64393498ae4/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg' }} style={styles.circularImage}/>
        </View>
        <View style={styles.textInputContainer}>
            <TextInput
                style={styles.input}
                label="Correo Electronico"
                // value={email}
                // onChangeText={setEmail}
                onChangeText={(email_text) =>{
                  console.log("Email ",email_text);
                  setNewUser({...newUser, email: email_text});
                }}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                label="Contraseña"
                // value={current_password}
                // onChangeText={setCurrentPassword}
                onChangeText={(password_text) =>{
                  console.log("Password ",password_text);
                  setNewUser({...newUser, current_password: password_text});
                }}
                secureTextEntry={true} 
            />

            <View style={styles.buttonContainer}>
                {/* <Button title="Iniciar sesión" onPress={handleLogin} style={styles.button} /> */}
                <View>
                    <TouchableOpacity onPress={handleLogin} /* style={styles.text_button} */ style={{shadowColor: '#000', alignItems: 'center', backgroundColor: '#4A90E2', padding: 10, textAlign:'center', fontWeight: 'bold'}}>
                        <Text style={{ color: '#FFF',fontWeight: 'bold'}}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.space}></View>
                {/* <Button title="Regresar" onPress={handleCancel} style={styles.button} /> */}
                <View>
                    <TouchableOpacity onPress={handleCancel} /* style={styles.text_button} */ style={{shadowColor: '#000', alignItems: 'center', backgroundColor: '#4A90E2', padding: 10, textAlign:'center', fontWeight: 'bold'}}>
                        <Text style={{ color: '#FFF',fontWeight: 'bold'}}>Regresar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            
        </View>
      </Card>

    </View>
  );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'column', // Alinea los botones en una fila horizontal
    },
    text_button:{
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        textAlign:'center',
    },
    button: {
        marginBottom: 10, // Espacio entre los botones
    },
    space: {
        height: 10, // Altura del espacio entre los botones
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    card: {
        marginHorizontal: 10,
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: -25,
        right: -25,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: 'center'
    },
    switchLabel: {
        marginLeft: 10,
        fontSize: 16,
    },
    phoneNumberContainer: {
        marginLeft: 30,
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
    gmailImage: {
        width: 70,
        height: 50,
        marginBottom: 20,
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    circularImage: {
        width: 100,
        height: 100, 
        borderRadius: 50, 
    },
    buttonContainer: {
        flexDirection: 'column', 
        justifyContent: 'space-evenly', // Espacio igual entre los botones
        marginVertical: 20, // Espacio vertical alrededor de los botones
    },
    textInputContainer: {
        paddingTop: 20
    },
});

export default LoginForm;