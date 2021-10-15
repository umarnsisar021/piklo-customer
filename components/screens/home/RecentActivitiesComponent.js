
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { useForm, Controller, FormProvider } from "react-hook-form";
// Theme Elements
import theme from '../../theme/style'
import no_data from '../../../assets/app/no-data.png'
import { connect } from 'react-redux';
import moment from "moment";
import { useNavigation } from '@react-navigation/native';
import ScreenLoader from '../component/ScreenLoader';

const getCurrentJobStatusColor = (status)=>{

}
function RecentActivitiesComponent(props) {
    const [data, setData] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const navigation = useNavigation();
    React.useEffect(() => {
        setData(props.data)
        setLoaded(true)
    }, [props.data])
    if (loaded) {
        if (data.length > 0) {
            return (
                <View>
                    <Text style={{ ...theme.f_20, color: '#707070' }}>Jobs Report</Text>

                    {/* ROW */}

                    {
                        data.map((row, index) => {
                            return <View key={index}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (row.id == props.onGoingJob.id) {
                                            navigation.navigate("OngoingJob", { task_id: row.id })
                                        }

                                    }}
                                    style={{ backgroundColor: row.id == props.onGoingJob.id ? "#126d5d2b" : '#F8F8F8', paddingHorizontal: 15, paddingVertical: 15, marginVertical: 5, borderRadius: 5, borderColor: '#E9E8E8', borderWidth: 1 }}>
                                    {/* ROW */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={{ color: '#7B7B7B' }}>{moment(`${row.starting_time}`).format('D MMM YY')} - {row.job_type == 1 ? "Intracity" : "Intercity"}</Text>
                                            <Text style={{ color: '#7B7B7B', textTransform: 'capitalize' }}>{row.customer_name}</Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={{
                                                    ...theme.f_12,
                                                    ...theme.pl_10,
                                                    ...theme.pr_10,
                                                    backgroundColor: '#1F9423',
                                                    ...theme.br_50,
                                                    ...theme.white
                                                }} >{row.current_job_status}</Text>
                                            {row.id == props.onGoingJob.id ? <Text style={{ ...theme.f_12, ...theme.pl_10, ...theme.pr_10, backgroundColor: '#FFA253', ...theme.br_50, ...theme.black, alignSelf: 'flex-end', ...theme.mt_5 }} >Ongoing</Text> : <></>}

                                        </View>
                                    </View>
                                    {/* ROW */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                        <View style={{ ...theme.row, ...theme.align_center }}>
                                            <Icon
                                                name='package'
                                                type='feather'
                                                color={theme.purple.color}
                                                size={28}
                                            />
                                            <Text style={{ ...theme.f_20, color: '#7B7B7B', ...theme.pl_5 }}>#{row.id}</Text>
                                        </View>
                                        <View style={{ ...theme.align_center }}>
                                            <Text style={{ ...theme.f_20, color: '#7B7B7B', ...theme.pl_5, ...theme.align_center }}>CAD {parseFloat(row.budget) + parseFloat(row.estimated)}</Text>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        })
                    }


                </View>)
        }
        else {
            return <View>
                <View style={{ paddingHorizontal: 0, paddingVertical: 0, marginVertical: 5, }}>
                    <Text style={{ ...theme.f_20, color: '#707070' }}>Jobs Report</Text>
                    {/* ROW */}
                    <View style={{ marginTop: 50 }}>
                        <View style={{ ...theme.row, ...theme.jc_center }}>
                            <Image source={no_data} resizeMode="contain" style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                        </View>

                    </View>
                    {/* ROW */}
                    <View style={{ ...theme.row, ...theme.jc_center }}>
                        <Text style={{ ...theme.f_16, color: '#7B7B7B', ...theme.pl_5 }}>No data found</Text>
                    </View>

                </View>
            </View>
        }

    }
    else {
        return <ScreenLoader />
    }

}



const mapDispatchToProps = (dispatch) => {
    return {
        // dispatching plain actions
    }
}
const mapStateToProps = (state) => {
    const { user, onGoingJob } = state
    return { user: user, userData: user.userDetails, onGoingJob: onGoingJob }
}
export default connect(mapStateToProps, mapDispatchToProps)(RecentActivitiesComponent)