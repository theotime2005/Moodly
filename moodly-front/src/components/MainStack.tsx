import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";

import { LoginScreen } from "../screens/LoginScreen";
import { EmployeeScreen } from "../screens/EmployeeScreen";
import { ManagerScreen } from "../screens/ManagerScreen";
import { DailySuggestionScreen } from "../screens/DailySuggestionScreen";
import { QuickActionsScreen } from "../screens/QuickActionsScreen";

const StackNavigator = stackNavigatorFactory();

/**
 * The main stack navigator for the whole app.
 */
export const MainStack = () => (
    <BaseNavigationContainer>
        <StackNavigator.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#A8E6CF",
                },
                headerShown: false,
            }}
        >
            <StackNavigator.Screen
                name="Login"
                component={LoginScreen}
            />
            <StackNavigator.Screen
                name="Employee"
                component={EmployeeScreen}
            />
            <StackNavigator.Screen
                name="Manager"
                component={ManagerScreen}
            />
            <StackNavigator.Screen
                name="DailySuggestion"
                component={DailySuggestionScreen}
            />
            <StackNavigator.Screen
                name="QuickActions"
                component={QuickActionsScreen}
            />
        </StackNavigator.Navigator>
    </BaseNavigationContainer>
);
