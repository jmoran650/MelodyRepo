import { NavigationContainer } from "@react-navigation/native";
import App from "./_layout"
import { enableScreens } from 'react-native-screens';
enableScreens();

const rootlayout = () => {
    return (
        <NavigationContainer>
            <App />
        </NavigationContainer>
    );
    }