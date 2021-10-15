
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View,Button, Image, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { useForm, FormProvider } from "react-hook-form";
// Theme Elements
import theme from '../../theme/style'
import ThemeButton from '../../theme/buttons'
import useJwt from '../../util/util'
import ActivitiesComponent from './ActivitiesComponent'
import { connect } from 'react-redux';
import ScreenLoader from '../component/ScreenLoader';
import moment from "moment/min/moment-with-locales";
moment.locale("en");
import DatePicker from 'react-native-date-ranges';
import { StatusBar } from 'expo-status-bar';

function OrderHistory(props) {
    const formMethods = useForm();
    let pickerRef = React.useRef();
    const [dateFilter,setDateFilter] = React.useState({
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
    });

    const [startDate,setStartDate] = React.useState(false);
    const [endDate,setEndDate] = React.useState(false);
    const [datePickerOpen,setDatePickerOpen] = React.useState(false);
    const [loaded,setLoaded] = React.useState(false);
    const [data,setData] = React.useState({
        delivers: 0,
        revenue : 0,
        jobs : [],
    });
    const handleOpenDatePicker = ()=>{
        pickerRef.setModalVisible()
    }

    const Run = async()=>{
       setLoaded(false)
        useJwt.post("drivers/Jobs/get_jobs_list",{
            limit:10,
            offset:0,
            ...dateFilter,
            token:props.user.token
        }).then((res)=>{
            if(res){

                setData(res.data.data)
                console.log(dateFilter)
                setLoaded(true)
            }
        }).catch(function (error) {

            if (error.response) {
                // Request made and server responded
                setData({
                    delivers: 0,
                    revenue : 0,
                    jobs : []
                })
                setLoaded(true)
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

    const handleSetDate = async (date)=>{


        let response = new Promise(async(res,rej)=>{
             await setDateFilter({
                 from_date: date.startDate,
                 to_date: date.endDate
             })
             res(200)
         }).then(async()=>{

             await Run();
         })
     }
    React.useEffect(()=>{

        Run();
    },[dateFilter])
    if (loaded){
        return (
            <View id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen }} >
              <StatusBar backgroundColor="transparent" />
              <DatePicker
                ref = {(ref)=> pickerRef = ref}
                style={{ borderWidth :0,width:0,height:0} }
                customStyles = { {
                    placeholderText:{ fontSize:20 ,color:'black'  }, // placeHolder style
                    headerStyle : { backgroundColor:'white',paddingTop : 0, paddingBottom:5,marginBottom:0},			// title container style
                    headerMarkTitle : { fontSize:18,}, // title mark style
                    headerDateTitle: { fontSize:16}, // title Date style
                    contentInput: {color:'black'}, //content text container style
                    contentText: {}, //after selected text Style
                } } // optional
                markText={"Select Date"}
                centerAlign // optional text will align center or not
                allowFontScaling = {false} // optional
                placeholder={''}
                mode={'range'}
                selectedBgColor={theme.purple.color}
	            selectedTextColor="white"
                onConfirm={handleSetDate}
                returnFormat='YYYY-MM-DD'
                customButton={(onConfirm)=>( <ThemeButton text="Done" width={100} height={35} onPressAction={onConfirm}  style={{marginBottom:0}}/>)}
              />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120,paddingTop:20 }} style={{ ...theme.px_30, }}>
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

                    <View >
                        <Text style={{ ...theme.f_30, ...theme.black,...theme.heading_font }}>Order History</Text>
                        <View style={{...theme.row,...theme.jc_space_between}}>
                            <Text style={{ ...theme.f_18, ...theme.gray ,...theme.text_font}}>
                                From 01 Jan 2021 To 10 Apr 2021

                            </Text>
                            <TouchableOpacity onPress={()=>handleOpenDatePicker()}>
                                    <Icon type="ionicon" name="calendar-outline" />
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View  {...formMethods}>
                        <View style={{...theme.my_10}}>
                            <Text style={{ ...theme.f_16, ...theme.py_10, ...theme.gray }}>Jobs Overview</Text>
                            <View style={{...theme.row,...theme.jc_space_between}}>
                                {/* Component */}
                                <LinearGradient
                                    colors={['#ffffff', '#ffffff']}
                                    style={{
                                        ...theme.w_45,
                                        ...theme.hp_100,
                                        ...theme.p_5 ,
                                        ...theme.br_10,
                                        ...theme.text_left
                                    }}>
                                    <Icon
                                        style={{ alignSelf:"flex-start",opacity: 0.5}}
                                        name="checkmark-done-outline"
                                        type="ionicon"
                                        size={40}
                                        color={theme.purple.color} />
                                    <View style={{ ...theme.absolute, right: 10, bottom: 10, ...theme.align_flex_end}}>
                                        <Text style={{ ...theme.text_center, ...theme.black,...theme.f_28}}>{data.delivers}</Text>
                                        <Text style={{ ...theme.purple,...theme.f_14}}>Delivered</Text>
                                    </View>
                                </LinearGradient>
                                {/* Component End */}
                                {/* Component */}
                                <LinearGradient
                                    colors={['#ffffff', '#ffffff']}
                                    style={{
                                        ...theme.w_45,
                                        ...theme.hp_100,
                                        ...theme.p_5,
                                        ...theme.br_10,
                                        ...theme.text_left
                                    }}>
                                    <Icon
                                        style={{ alignSelf: "flex-start", opacity: 0.5 }} name="checkmark-done-outline"
                                        type="ionicon"
                                        size={40}
                                        color={theme.purple.color} />
                                    <View style={{ ...theme.absolute, right: 10, bottom: 10, ...theme.align_flex_end }}>
                                        <Text style={{ ...theme.text_center, ...theme.black, ...theme.f_28 }}>C$ {data.revenue}</Text>
                                        <Text style={{ ...theme.purple, ...theme.f_14}}>Revenue</Text>
                                    </View>
                                </LinearGradient>
                                {/* Component End */}
                            </View>
                        </View>

                    </View>
                    <View style={{ ...theme.hp_20 }} />
                    <ActivitiesComponent  data={data.jobs}/>
                </ScrollView>
            </View>
        )
    }
    else{
        return <ScreenLoader />
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
    }
}
const mapStateToProps = (state) => {
    const { user } = state
    return { user: user, userData: user.userDetails}
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory)