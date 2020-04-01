import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons'
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location'

// import { Container } from './styles';
import api from '../services/api'
import background from '../../assets/background.png'

export default function addDev({navigation}) {
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const[github_username, setGithub_username] = useState('');
    const[techs, setTechs] = useState('');

    useEffect(() =>{
        async function loadInitialPosition(){
            const {granted} = await requestPermissionsAsync()
            if(granted) {
                const {coords} = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });
                const {latitude, longitude} = coords;

                setLatitude(latitude);
                setLongitude(longitude);
            }
        }
        loadInitialPosition()
    },[])

    async function handleSubmit(){
        const response = await api.post('/devs', {
            github_username,
            techs,
            latitude,
            longitude
        })
        if(response.status == 200){
            Alert.alert(
                'Aviso',
                'Salvo com Sucesso',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
              );
            navigation.navigate('Main');
        } else if (response.status != 200){
            Alert.alert(
                'Erro',
                'Verifique os dados',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
              );
        }
    }
    return (
    <ImageBackground source={background} style={{width: '100%', height: '100%'}}>
    <ScrollView style={styles.scroll}>
        <View style={styles.container}>
            <TextInput
            style={styles.input}
            placeholderTextColor="#999"
            placeholder="Usuário do Github"
            autoCapitalize="none"
            autoCorrect={false}
            value={github_username}
            onChangeText={setGithub_username}
            />

            <TextInput
            style={styles.input}
            placeholder="Tecnologias"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            value={techs}
            onChangeText={setTechs}
            />
            <View style={styles.coordinates}>
                <View style={styles.itemCordinates}>
                <Text style={styles.descText}>Latitude</Text>
                <TextInput
                style={styles.inputCoordinates}
                value={latitude.toString()}
                onChangeText={setLatitude}
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                />   
                </View>
                <View>
                <Text style={styles.descText}>Longitude</Text>
                <TextInput
                value={longitude.toString()}
                onChangeText={setLatitude}
                style={styles.inputCoordinates}
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                />    
                </View>         
            </View>
            
        <TouchableOpacity style={styles.send} onPress={handleSubmit}>
            <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>
        </View>
    </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        top: 20,
        bottom: 20,
    },
    container: {
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

    },
    send: {
        width: '100%',
        height: 50,
        backgroundColor: '#8E4dFF',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    btnText: {
        color: '#f2f2f2',
        fontSize: 17,
    },
    input: {
        flex: 1,
        height: 50,
        width: '100%',
        color: '#333',
        borderRadius: 5,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#acacac',
        fontSize: 18
    },
    inputCoordinates: {
        height: 40,
        width: 160,
        maxWidth: '100%',
        color: '#333',
        borderRadius: 5,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#acacac',
        fontSize: 18,
        
    },
    descText: {
        color: '#999',
        fontSize: 18,
        marginBottom: 2,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 10

    },

    coordinates: {
        marginLeft: 0,
        marginRight: 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    itemCordinates: {
        marginLeft: 0,
        marginRight: 0,
        width: '50%',
        flexDirection: 'column'
    }

})