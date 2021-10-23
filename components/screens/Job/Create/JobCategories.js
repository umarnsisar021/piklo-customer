
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, Dimensions, Platform, StyleSheet } from 'react-native';
import { useForm, Controller, FormProvider } from "react-hook-form";
import { connect } from 'react-redux';
import { Icon, CheckBox } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';

// Theme Elements
import theme from '../../../theme/style'
import notification from '../../../../assets/app/notification.png'
import ScreenLoader from '../../component/ScreenLoader';
import useJwt from '../../../util/util';

const screenHeight = Dimensions.get('screen').height;
function JobCategories(props) {
    const formMethods = useForm();
    const [buttonRef,setButtonRef] = React.useState({});
    const onSubmit = data => console.log(data);
    const [data, setData] = React.useState(props.appData.jobCategories);
    const [loaded, setLoaded] = React.useState(false);
    // let { id } = props.route.params;


    const CreateButtonRef = async ()=>{
        let tempArray = {};
        await Object.values(data).map((row, key) => {
            tempArray[key] ={};
            tempArray[key].checked = false;
        });
        await setButtonRef(tempArray);
        setLoaded(true);
    }
    const handleSelectCategory = async (c_key)=>{
        let tempArray = {};
        await Object.values(data).map((row, key) => {
            if (c_key == key){
                tempArray[key] = {};
                tempArray[key].checked = true;
            }
            else{
                tempArray[key] = {};
                tempArray[key].checked = false;
            }
        });
        await setButtonRef(tempArray);
    }


    React.useEffect(() => {

        CreateButtonRef();


        const Run = async () => {
            useJwt.setToken(props.user.token);
            await useJwt.get("Common/categories").then(async (res) => {
                if (res.data) {
                    setData(res.data.data.categories);
                    props.setJobCategories(res.data.data.categories);
                    setLoaded(true);
                }
            }).catch(function (error) {
                if (error.response) {
                    // Request made and server responded
                    //notifyError('Error!', '', data.message)
                } else if (error.request) {
                    // The request was made but no response was received
                    // console.log(error.request)
                } else {
                    // Something happened in setting up the request that triggered an Error
                    //console.log('Error', error.message)
                }
            })
        }
        Run();

    }, [])
    if (loaded) {

        return (

            <View id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen, height: '100%' }} >
                <ScrollView showsVerticalScrollIndicator={false} style={{ ...theme.px_30, ...theme.mt_40, marginBottom: 30, paddingBottom: 0, marginTop: 20 }}>
                    <StatusBar backgroundColor="transparent" />
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.goBack()
                        }}
                        style={{
                            ...theme.py_10,
                            justifyContent: 'flex-start',
                            alignSelf: 'flex-start'
                        }}
                    >
                        <Icon type="feather" name="chevrons-left" size={40} color={theme.purple.color} />
                    </TouchableOpacity>
                    <Text style={{ ...theme.f_30, ...theme.black, ...theme.heading_font }}>Pickup Categories</Text>
                    <View>
                        <Text style={{ ...theme.f_16 }}>Choose a category</Text>
                    </View>
                    <View style={{ ...theme.py_15 }}>
                        <View style={stylesGrid.sectionContainer}>
                            {Object.values(data).map((row, key) => {
                                return <TouchableOpacity
                                            key={key}
                                            style={stylesGrid.boxContainer}
                                            onPress={() => { handleSelectCategory(key) }}>

                                            <CheckBox
                                                title=''
                                                checkedIcon='check-circle'
                                                uncheckedIcon='times'
                                                checkedColor={theme.purple.color}
                                                checked={buttonRef[key].checked ? true: false}
                                                containerStyle={buttonRef[key].checked ? {position:'absolute',zIndex:100,top: '-10%',right:'-10%'} : { display: 'none' }}

                                            >
                                            </CheckBox>


                                            <Image source={{uri:row.icon_path}} style={{width:'45%',height:'50%',resizeMode:'contain'}}></Image>
                                            <Text style={{fontWeight:'600',width:'100%',alignSelf:'center',textAlign:'center'}}>{row.name}</Text>
                                </TouchableOpacity>
                            })}
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
    else {
        return <ScreenLoader />
    }
}


const rows = 5;
const cols = 2;
const marginHorizontal = 4;
const marginVertical = 4;
const rect = (Dimensions.get('window').width / cols) - (marginHorizontal * (cols + 1))-30;
const stylesGrid = StyleSheet.create({
    scrollContainer: {

    },
    sectionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent:'space-between'
    },
    boxContainer: {
        marginTop: 10,
        marginBottom: marginVertical,
        marginLeft: marginHorizontal,
        marginRight: marginHorizontal,
        width: rect,
        height: rect,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius:15,
        borderWidth:1,
        borderColor:theme.purple.color,

    },
});
const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setDeviceId: (data) => dispatch({ type: 'SET_DEVICE_ID', payload: data }),
        setJobCategories: (data) => dispatch({ type: 'SET_JOB_CATEGORIES', payload: data }),
        setJobRequestFormData: (data) => dispatch({ type: 'SET_JOB_REQUEST_FORM_DATA', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { user, appData, jobRequestFormData} = state
    return { user: user, userData: user.userDetails, appData: appData, jobRequestFormData: jobRequestFormData.jobRequestFormData }
}
export default connect(mapStateToProps, mapDispatchToProps)(JobCategories)