import React, { useEffect } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JobCategories from '../screens/Job/Create/JobCategories';
import theme from '../theme/style'
import JobCategoriesTabComponents from './JobCategoriesTabComponents'
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';

const Tab = createBottomTabNavigator();

function JobCategoriesTab(props) {
    return (
        <Tab.Navigator screenOptions={{ tabBarStyle: { ...style.main,}}}>
            <Tab.Screen options={{
                headerShown: false,
                tabBarButton: ({ focused }) => {
                    return <JobCategoriesTabComponents {...props} />
                },
                tabBarShowLabel: false,
            }} style={{ width: '100%', backgroundColor: 'gray' }}
                name="HomeTab" children={(childProps) => <JobCategories {...childProps}  />} />
        </Tab.Navigator>
    )
}

const style = StyleSheet.create({
    main: {
        ...theme.hp_50,
        backgroundColor:'#ffffff'
    },

})
export default JobCategoriesTab