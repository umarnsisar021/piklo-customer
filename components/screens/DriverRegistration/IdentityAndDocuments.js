
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity,BackHandler, View, Image, StatusBar, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { useForm, FormProvider } from "react-hook-form";
import ThemeDateTimePicker from '../../theme/form/ThemeDateTimePicker'
import * as DocumentPicker from 'expo-document-picker';
// Theme Elements
import ScreenLoader from "../component/ScreenLoader";
import ThemeInput from '../../theme/form/Input'
import theme from '../../theme/style'
import ThemeButton from '../../theme/buttons'
import useJwt from '../../util/util';
import { cos } from 'react-native-reanimated';
import Toast from 'react-native-root-toast';
import * as FileSystem from 'expo-file-system';
import { connect } from 'react-redux';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
async function getDocumentFields(params) {
    let data = [];
    await useJwt.get('Common/documents_types').then((res)=>{
        if (res.data.data.records) {
            data = res.data.data.records
        }
    })
    return data;
}
function IdentityAndDocuments(props) {

    const formMethods = useForm();
    let formErrors = formMethods.formState.errors;
    let docRef = React.useRef({});
    let inputRef = React.useRef();
    const [documentsData, setDocumentsData] = React.useState();
    const [loaded, setLoaded] = React.useState(false);

    const setFiles = async (type_id,side) => {
        setLoaded(false)
        let result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
        });
        let base64 = await FileSystem.readAsStringAsync(result.uri,
            { encoding: FileSystem.EncodingType.Base64});
        base64 = 'data:image/png;base64,' + base64
        let Oldvalues = formMethods.getValues('documents');
        //let documents = formMethods.getValues('documents');
        let values =[]
        let tempArray = {};
        if (typeof formMethods.getValues('documents') !== 'undefined') {
            tempArray = Oldvalues;
            if (Oldvalues[type_id]){
                tempArray[type_id][side] = base64
            }
            else{
                tempArray[type_id] = {}
                tempArray[type_id][side] = base64
            }
        }
        else{
            tempArray[type_id] = {}
            tempArray[type_id][side] = base64
        }
        //console.log(tempArray)
        formMethods.setValue("documents", tempArray)
        setLoaded(true)

    };
    React.useEffect(()=>{
        const Run = async () => {
            let a = await getDocumentFields();
            setDocumentsData(a);
            docRef.current=[];
            await Object.values(a).map((row)=>{
                docRef.current[row.id] = React.createRef();
            })
            setLoaded(true);
        }
        Run();
        inputRef.current = {};
        inputRef.current['ssn_id'] = React.createRef();
        inputRef.current['ssn_id_expiry_date'] = React.createRef();

    },[])
    React.useEffect(()=>{
        if(Object.keys(formErrors).length > 0){
            Object.values(formErrors).map((e,index)=>{
                if(index == 0 ){
                    if(Object.keys(inputRef.current[e.ref.name]).length > 2){
                        let toast = Toast.show('Please fill the required fields', {
                            duration: Toast.durations.LONG,
                            position: Toast.positions.BOTTOM,
                            shadow: true,
                            animation: true,
                            hideOnPress: true,
                            visible:true,
                            backgroundColor: '#ff9d9d',
                            textColor:'#000000',
                            delay: 0,

                        });
                        inputRef.current[e.ref.name].focus()
                    }
                }
            })
        }

    },[formMethods.formState])

    const onSubmit = async data => {
        let clear = true;
        if(data.documents)
        {
            const ProceedValidate = new Promise((resolve, reject) => {
                for (var i = 0; i < documentsData.length; i++) {
                    let id = documentsData[i]['id'];
                    let d = documentsData[i];
                    if(d.required == '1' || d.required == '2' || d.required == '3'){

                        if(d['side'] == '1'){
                            if(typeof data.documents[id] == 'undefined'){
                                docRef.current[id].current.setNativeProps({style:{opacity : 1}});
                                clear = false;
                            }
                        }
                        else if(d['side']  == '2'){
                            if(typeof data.documents[id] == 'undefined'){
                                docRef.current[id].current.setNativeProps({style:{opacity : 1}});
                                clear = false;
                            }
                        }
                        else if(d['side'] == '3'){
                            if(typeof data.documents[id] == 'undefined'){
                                docRef.current[id].current.setNativeProps({style:{opacity : 1}});
                                clear = false;

                            }
                            else if (typeof data.documents[id]['side_front']  == 'undefined'){
                                docRef.current[id].current.setNativeProps({style:{opacity : 1}});
                                clear = false;
                            }
                            else if (typeof data.documents[id]['side_back']  == 'undefined'){
                                docRef.current[id].current.setNativeProps({style:{opacity : 1}});
                                clear = false;
                            }
                        }
                    }
                    if(i == (documentsData.length)-1){
                        resolve()
                    }
                }
            }).then(()=>{
                if(clear){
                    props.setIdentityAndDocuments(data);
                    Toast.show('Saved.', {});
                    props.navigation.navigate('VehicleInformation');
                }
            })


        }
        else{
            let toast = Toast.show('Please upload required documents.', {backgroundColor: '#ff9d9d',textColor:'#000000',});
        }
     }
    if(loaded){
        return (<>

            <LinearGradient id='Main-page' colors={['#ffffff', '#ffffff']} style={{ ...theme.main_screen }} >
                <ScrollView   showsVerticalScrollIndicator={false} style={{ ...theme.px_30, ...theme.py_20, ...theme.mt_40 }}>
                    <Text style={{ ...theme.f_32,...theme.black,...theme.heading_font }}>Identities & Documents</Text>
                    <Text style={{ ...theme.f_18, ...theme.orange }}>Step 2 / 5</Text>

                    <FormProvider  {...formMethods}>
                        <View
                            style={{
                                ...theme.row,

                                ...theme.p_0,
                                ...theme.mt_20,
                            }}>
                            <ThemeInput MainConatainerStyle={{ ...theme.w_65, ...theme.mt_0, ...theme.p_0, borderWidth: 0, ...theme.mb_0 }}
                                InputConatainerStyle={{ width: '80%' }}
                                Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                                TextInput={{
                                    placeholder: 'SSN / SIN',
                                    keyboardType:'numeric',
                                    ref: (input) => inputRef.current['ssn_id'] = input
                                }}
                                name='ssn_id'
                                defaultValue=""
                                rules={{ required: true }}
                                error={formErrors.ssn_id} />



                            <ThemeDateTimePicker
                                MainConatainerStyle={{ ...theme.w_35, ...theme.mt_0, ...theme.mb_0, borderWidth: 0 }}
                                InputConatainerStyle={{ width: '80%' }}
                                Icon={<Icon name='calendar-outline' type='ionicon' color='#449284' />}
                                TextInput={{
                                    placeholder: 'Expiry Date',
                                    ref: (input) => inputRef.current['ssn_id_expiry_date'] = input
                                }}
                                name='ssn_id_expiry_date'
                                defaultValue=""
                                rules={{ required: true }}
                                error={formErrors.ssn_id_expiry_date}
                            />

                        </View>
                        <View
                            style={{
                                ...theme.row,
                                borderRadius: 5,
                                ...theme.p_0,
                                ...theme.mt_15,
                            }}>
                            <ThemeInput MainConatainerStyle={{ ...theme.w_40, ...theme.mt_0, ...theme.p_0, borderWidth: 0, ...theme.mb_0 }}
                                InputConatainerStyle={{width:'80%'}}
                                Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                                TextInput={{
                                    placeholder: 'Driving License',
                                    keyboardType:'numeric',
                                    ref: (input) => inputRef.current['driving_license_no'] = input
                                }}
                                name='driving_license_no'
                                defaultValue=""
                                rules={{ required: true }}
                                error={formErrors.driving_license_no} />
                            <ThemeInput MainConatainerStyle={{ ...theme.w_25, ...theme.mt_0, ...theme.p_0, borderWidth: 0, ...theme.mb_0 }}
                                InputConatainerStyle={{ width:'80%' }}
                                Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                                TextInput={{
                                    placeholder: 'Class',
                                    ref: (input) => inputRef.current['driving_license_class'] = input
                                }}
                                name='driving_license_class'
                                defaultValue=""
                                rules={{ required: true }}
                                error={formErrors.driving_license_class} />
                            <ThemeDateTimePicker
                                MainConatainerStyle={{ ...theme.w_35, ...theme.mt_0, ...theme.mb_0, borderWidth: 0 ,marginTop:-7}}
                                InputConatainerStyle={{ width: '80%',}}
                                Icon={<Icon name='calendar-outline' type='ionicon' color='#449284' />}
                                TextInput={{
                                    placeholder: 'Expiry Date',
                                    textContentType: 'password',
                                    style:{paddingBottom: 10,},
                                    ref: (input) => inputRef.current['driving_license_expiry_date'] = input
                                }}
                                name='driving_license_expiry_date'
                                defaultValue=""
                                rules={{ required: true }}
                                error={formErrors.driving_license_expiry_date}
                            />
                        </View>
                        <View style={{ ...theme.row, ...theme.jc_space_between, ...theme.mt_10, }}>
                            <ThemeInput
                                MainConatainerStyle={{}}
                                InputConatainerStyle={{ width: '80%' }}
                                Icon={<Icon name='reorder-three-outline' type='ionicon' color='#449284' />}
                                TextInput={{
                                    placeholder: 'GST / HST ',
                                    keyboardType: 'numeric'
                                }}
                                name='gst_hst_no'
                                defaultValue=""
                                rules={{ required: true }}
                                error={formErrors.gst_hst_no}
                            />

                        </View>

                        <Text ellipsizeMode="clip" numberOfLines={1} style={{ fontWeight: '700', color: '#A4A4A4' }}>
                            - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                            - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                            - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                            - - - - - - - - - - - - - - - - -
                        </Text>
                        {Object.values(documentsData).map((d,index)=>{
                            if (d.required > 0) {
                                return (

                                    <View style={{...theme.my_10}} key={index}>
                                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                            <Text style={{ ...theme.f_14 ,...theme.gray}}>{d.name}</Text>
                                            <Text ref={docRef.current[d.id]} style={{ ...theme.f_14 ,...theme.orange,opacity:0}}>Required</Text>
                                        </View>

                                        <View style={{
                                            ...theme.row,
                                            ...theme.jc_space_between,
                                            ...theme.my_10,
                                            justifyContent: d.side < 3 ? 'center':'space-between'
                                        }}>
                                            {
                                                d.side == 1 ?
                                                    <TouchableOpacity onPress={() => setFiles(d.id,'side_front')}
                                                style={{
                                                    ...theme.bg_light_gray,
                                                    ...theme.border_gray,
                                                    ...theme.br_20,
                                                    width: '48%',
                                                    ...theme.hp_100,
                                                    ...theme.border,
                                                    ...theme.align_center
                                                }}>
                                                {formMethods.getValues('documents') ?
                                                    formMethods.getValues('documents')[d.id] ?
                                                    <Image source={{ uri: formMethods.getValues('documents')[d.id]['side_front'] }} style={{ ...theme.w_100, ...theme.h_100, resizeMode: 'center' }} /> :
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Icon type="ionicon" name="cloud-upload-outline" size={30} />
                                                        <Text>Front</Text>
                                                    </View> :
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                                        <Icon type="ionicon" name="cloud-upload-outline" size={30} />
                                                        <Text>Front</Text>
                                                    </View>
                                                }
                                                </TouchableOpacity> : <></>
                                            }
                                            {
                                                d.side == 2 ?
                                                    <TouchableOpacity onPress={() => setFiles(d.id, 'side_back')} style={{ ...theme.bg_light_gray, ...theme.border_gray, ...theme.br_20, width: '48%', ...theme.hp_100, ...theme.border }}>

                                                    {formMethods.getValues('documents') ?
                                                        formMethods.getValues('documents')[d.id] ?
                                                        <Image source={{ uri: formMethods.getValues('documents')[d.id]['side_back'] }} style={{ ...theme.w_100, ...theme.h_100, resizeMode: 'center' }} /> :
                                                        <View  style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                                            <Icon type="ionicon" name="cloud-upload-outline" size={30} />
                                                            <Text>Back</Text>
                                                        </View> :
                                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                                            <Icon type="ionicon" name="cloud-upload-outline" size={30} />
                                                            <Text>Back</Text>
                                                        </View>
                                                    }

                                                    </TouchableOpacity> : <></>
                                            }
                                            {
                                                d.side == 3 ?
                                                    <View style={{width:'100%',...theme.row,...theme.jc_space_between}}>
                                                        <TouchableOpacity onPress={() => setFiles(d.id, 'side_front')}
                                                        style={{
                                                            ...theme.bg_light_gray,
                                                            ...theme.border_gray,
                                                            ...theme.br_20,
                                                            width: '48%',
                                                            ...theme.hp_100,
                                                            ...theme.border,
                                                            ...theme.align_center
                                                        }}>
                                                        {formMethods.getValues('documents') ?
                                                            formMethods.getValues('documents')[d.id] ?
                                                            formMethods.getValues('documents')[d.id]['side_front'] ?
                                                            <Image source={{ uri: formMethods.getValues('documents')[d.id]['side_front'] }} style={{ ...theme.w_100, ...theme.h_100, resizeMode: 'center' }} />:
                                                            <View  style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                                                <Icon type="ionicon" name="cloud-upload-outline" size={30} />
                                                                <Text>Front</Text>
                                                            </View>
                                                             :
                                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                                                <Icon type="ionicon" name="cloud-upload-outline" size={30} />
                                                                <Text>Front</Text>
                                                            </View> :
                                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                                                <Icon type="ionicon" name="cloud-upload-outline" size={30} />
                                                                <Text>Front</Text>
                                                            </View>
                                                        }

                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => setFiles(d.id, 'side_back')} style={{ ...theme.bg_light_gray, ...theme.border_gray, ...theme.br_20, width: '48%', ...theme.hp_100, ...theme.border }}>
                                                        {formMethods.getValues('documents') ?
                                                        formMethods.getValues('documents')[d.id] ?
                                                        formMethods.getValues('documents')[d.id]['side_back'] ?
                                                            <Image source={{ uri: formMethods.getValues('documents')[d.id]['side_back'] }} style={{ ...theme.w_100, ...theme.h_100, resizeMode: 'center' }} />:
                                                            <View  style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                                                <Icon type="ionicon" name="cloud-upload-outline" size={30} />
                                                                <Text>Back</Text>
                                                            </View>
                                                             :
                                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                                                <Icon type="ionicon" name="cloud-upload-outline" size={30} />
                                                                <Text>Back</Text>
                                                            </View> :
                                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                                                <Icon type="ionicon" name="cloud-upload-outline" size={30} />
                                                                <Text>Back</Text>
                                                            </View>
                                                        }

                                                    </TouchableOpacity></View> : <></>
                                            }


                                        </View>
                                    </View>
                                )
                            }
                        })}
                        <View
                            style={{
                                ...theme.w_100,
                                ...theme.align_center,

                            }}>
                            <View  style={{
                                ...theme.row,
                                ...theme.align_center,
                                ...theme.mb_30,
                            }}>
                                <ThemeButton  style={{ width: '100%' }} text="NEXT STEP - VEHICLE INFORMATION" onPressAction={formMethods.handleSubmit(onSubmit)} />
                            </View>
                        </View>
                    </FormProvider>
                </ScrollView>


            </LinearGradient>

        </>
        )
    }
    else{
        return <ScreenLoader/>
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
        setIdentityAndDocuments: (data) => dispatch({ type: 'SET_SIGNUP_STEP_2', payload: data }),
    }
}
const mapStateToProps = (state) => {
    const { signup } = state
    return { signup: signup }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentityAndDocuments)