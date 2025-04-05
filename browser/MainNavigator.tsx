import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import WelcomeScreen from "../screens/WelcomeScreen";
import Pantalla1Screen from "../screens/Pantalla1Screen";
import Pantalla2Screen from "../screens/Pantalla2Screen";



const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MyStack() {
  return <Stack.Navigator>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Drawer" component={MyDrawer} />
  </Stack.Navigator>;
}

function MyDrawer() {
  return <Drawer.Navigator>
    <Drawer.Screen name="Pantalla 1" component={Pantalla1Screen} />
    <Drawer.Screen name="Pantalla 2" component={Pantalla2Screen} />
  </Drawer.Navigator>;
}

export default function MainNavigator(){
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
};