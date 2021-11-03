import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator,StyleSheet } from 'react-native';
import { Overlay } from 'react-native-elements';
import theme from '../theme/style'
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
function JobCategoriesTabComponents(props) {

    const [visible, setOverlay] = React.useState(false);
    const handleRequestNow = async (value) => {

    };

    useEffect(() => {
        //Run()
    }, [])
    //Run()

    return <View style={{ ...style.main }}>
        <View style={{ ...style.footer_container }}>
            <View style={{ width: '50%', justifyContent: 'center', }}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("JobCategories")}
                    style={{
                        ...theme.row,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#E66A71',
                        ...theme.jc_center,
                        ...theme.align_center,
                        // ...theme.br_25

                    }}
                >
                    <Text style={{ ...theme.white }}>Schedule </Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: '50%'}}>
                <TouchableOpacity
                    onPress={async () => {
                        if (props.jobRequestFormData.category_id){
                            await props.setJobRequestFormData({ ...props.jobRequestFormData, start_at:1})
                            props.navigation.navigate("JobCreatePickups")
                        }else{
                            Toast.show("Please select category!!!")
                        }
                    }}
                    style={{
                        ...theme.row,
                        width: '100%',
                        height: '100%',
                        ...theme.bg_purple,
                        ...theme.jc_center,
                        ...theme.align_center,
                        // ...theme.br_25
                    }}
                >
                    <Text style={{ ...theme.white }} >Request Now</Text>
                </TouchableOpacity>
            </View>

        </View>
        <Overlay isVisible={visible} >
            <ActivityIndicator size="large" color={theme.purple.color} />
            <Text>Updating...</Text>
        </Overlay>
    </View>

}

const style = StyleSheet.create({
    main: {
        ...theme.w_100,
        ...theme.hp_50,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#ffffff',
    },
    footer_container: {
        ...theme.row,
        ...theme.align_center,
        ...theme.jc_space_between,
        backgroundColor: '#ffffff',
    }
})


const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setJobRequestFormData: (data) => dispatch({ type: 'SET_JOB_REQUEST_FORM_DATA', payload: data }),

    }
}
const mapStateToProps = (state) => {
    const { user, jobRequestFormData} = state
    return { user: user, userData: user.userDetails, jobRequestFormData: jobRequestFormData.jobRequestFormData }
}
export default connect(mapStateToProps, mapDispatchToProps)(JobCategoriesTabComponents);