import * as React from 'react';
import { ActivityIndicator, Text, View, Image, StatusBar, StyleSheet} from 'react-native';
import { connect } from 'react-redux';
import theme from '../../../theme/style';

// Theme Elements

const ScreenLoader = (props) => {

        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color={theme.purple.color} />
            </View>
        )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setPersonalInformation: (data) => dispatch({ type: 'SET_SIGNUP_STEP_1', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { signup } = state
    return { signup: signup }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenLoader)