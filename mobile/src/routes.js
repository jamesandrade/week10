import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import {MaterialIcons} from '@expo/vector-icons'

import Main from './pages/Main'
import Profile from './pages/Profile'
import AddDev from './pages/AddDev'

const Routes = createAppContainer(
    createStackNavigator({
        Main: {
            screen: Main,
            navigationOptions: {
                title: `DevRadar`
            }, 
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                title: 'Perfil no Github'
            }
        },
        AddDev: {
            screen: AddDev,
            navigationOptions: {
                title: 'Adicionar Dev.'
            }
        }

    }, {
        defaultNavigationOptions: {
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerStyle: {
                backgroundColor: '#7D40E7'
            }
        }
    })
)

export default Routes