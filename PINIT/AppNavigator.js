import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginPage from './screens/LoginPage';
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{headerShown: false}}
      />
      <Stack.Screen 
            name="Login" 
            component={LoginPage}
            options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
