import React, {useEffect, useState} from 'react';
import {StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard} from 'react-native'
import MapView, {Marker, Callout} from 'react-native-maps'
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location'
import {MaterialIcons} from '@expo/vector-icons'

import api from '../services/api'
import {connect, disconnect, subscribeToNewDevs} from '../services/socket'


function Main({navigation}) {
    const [currentRegion, setCurrentRegion] = useState(null)
    const [devs, setDevs] = useState([])
    const [techs, setTechs] = useState('')

    useEffect(() =>{
        async function loadInitialPosition(){
            const {granted} = await requestPermissionsAsync()
            if(granted) {
                const {coords} = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });
                const {latitude, longitude} = coords
                setCurrentRegion({
                    latitude, 
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04 
                })
            }
        }
        loadInitialPosition()
    },[])

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]))
    }, [devs])

    function setupWebsocket(){
        disconnect()
        const {latitude, longitude} = currentRegion
        connect(
            latitude,
            longitude,
            techs
        );
    }
    function addDev(){
        navigation.navigate('AddDev');

    }

    async function loadDevs(){
        Keyboard.dismiss();

        const {latitude, longitude} = currentRegion
        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        })
        setDevs(response.data.devs)
        setupWebsocket()
    }
    function handleRegionChanged(region){
        setCurrentRegion(region)
    }
    if(!currentRegion){
        return null
    }
    return (
        <>
        <MapView
         showsCompass={false}
         initialRegion={currentRegion}
         onRegionChangeComplete={handleRegionChanged}
         style={styles.map}>
             {devs.map(dev => (
                 <Marker 
                 key={dev._id} 
                 coordinate={
                     {
                        longitude: dev.location.coordinates[0],
                        latitude: dev.location.coordinates[1]
                      }
                      }>                     
                 <Image 
                 style={styles.avatar}
                 source={{uri: dev.avatar_url}}
                 />
                 <Callout onPress={() => {
                     navigation.navigate('Profile', {github_username: dev.github_username});
                 }}>
                     <View style={styles.callout}>
                         <Text style={styles.devName}>{dev.name}</Text>
                         <Text style={styles.devBio}>{dev.bio}</Text>
                         <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                     </View>
                 </Callout>
              </Marker>
             ))}
         </MapView>
         <View style={styles.searchForm}>
             <TextInput 
             style={styles.searchInput}
             placeholder="Buscar Devs por techs..."
             placeholderTextColor="#999"
             autoCapitalize="words"
             autoCorrect={false}
             returnKeyType="send"
             value={techs}
             onChangeText={setTechs}
             />
             <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                <MaterialIcons name="my-location"  color="#fff" size={20} />
             </TouchableOpacity>                      
         </View>
         <View style={styles.addForm}>
            <TouchableOpacity onPress={addDev} style={styles.addButton}>
                <MaterialIcons name="add"  color="#fff" size={25} />
             </TouchableOpacity>
         </View>
         </>
    )}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },
    callout: {
        width: 260
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    devBio: {
        color: '#666',
        marginTop: 5
    },
    devTechs: {
        marginTop: 5
    },
    searchForm: {
        top: 20,
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',

    },
    addForm: {
        position: 'absolute',
        flex:3,
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8E4dFF',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},

    },

    addButton: {
        width: 50,
        height: 50,
        backgroundColor: '#76D366',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    }
})

export default Main