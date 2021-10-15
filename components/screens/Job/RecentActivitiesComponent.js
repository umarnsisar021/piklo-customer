
import * as React from 'react';
import { Text, ScrollView, TouchableOpacity, View, Image, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { useForm, Controller, FormProvider } from "react-hook-form";

// Theme Elements
import theme from '../../theme/style'


export default function RecentActivitiesComponent(props) {

    return (
        <View>
            <Text style={{ ...theme.f_20, color:'#707070'}}>Recent Activities</Text>
            <View>
                <View style={{ backgroundColor: '#F8F8F8', paddingHorizontal: 15, paddingVertical: 15, marginVertical: 10, borderRadius: 5, borderColor:'#E9E8E8',borderWidth:1}}>
                    {/* ROW */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <Text style={{ color:'#7B7B7B'}}>10 APR 2021 - Intracity</Text>
                            <Text style={{ color: '#7B7B7B' }}>John Miller</Text>
                        </View>
                        <View>
                            <Text style={{ ...theme.f_12, ...theme.pl_10, ...theme.pr_10, backgroundColor: '#00C406', ...theme.br_50,...theme.white}} >COMPLETED</Text>
                        </View>
                    </View>
                    {/* ROW */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:20}}>
                        <View style={{...theme.row,...theme.align_center}}>
                            <Icon
                                name='package'
                                type='feather'
                                color='#449284'
                                size={36}
                            />
                            <Text style={{ ...theme.f_20, color:'#7B7B7B',...theme.pl_5}}>343434</Text>
                        </View>
                        <View style={{...theme.align_center}}>
                            <Text style={{ ...theme.f_20, color: '#7B7B7B', ...theme.pl_5, ...theme.align_center }}>CAD 20</Text>
                        </View>
                    </View>

                </View>
            </View>


            {/* ROW */}
             <View>
                <View style={{ backgroundColor: '#F8F8F8', paddingHorizontal: 15, paddingVertical: 15, marginVertical: 10, borderRadius: 5, borderColor:'#E9E8E8',borderWidth:1}}>
                    {/* ROW */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <Text style={{ color:'#7B7B7B'}}>10 APR 2021 - Intracity</Text>
                            <Text style={{ color: '#7B7B7B' }}>John Miller</Text>
                        </View>
                        <View>
                            <Text style={{ ...theme.f_12, ...theme.pl_10, ...theme.pr_10, backgroundColor: '#00C406', ...theme.br_50,...theme.white}} >COMPLETED</Text>
                        </View>
                    </View>
                    {/* ROW */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:20}}>
                        <View style={{...theme.row,...theme.align_center}}>
                            <Icon
                                name='package'
                                type='feather'
                                color='#449284'
                                size={36}
                            />
                            <Text style={{ ...theme.f_20, color:'#7B7B7B',...theme.pl_5}}>343434</Text>
                        </View>
                        <View style={{...theme.align_center}}>
                            <Text style={{ ...theme.f_20, color: '#7B7B7B', ...theme.pl_5, ...theme.align_center }}>CAD 20</Text>
                        </View>
                    </View>

                </View>
            </View>
            <View>
                <View style={{ backgroundColor: '#F8F8F8', paddingHorizontal: 15, paddingVertical: 15, marginVertical: 10, borderRadius: 5, borderColor: '#E9E8E8', borderWidth: 1 }}>
                    {/* ROW */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ color: '#7B7B7B' }}>10 APR 2021 - Intracity</Text>
                            <Text style={{ color: '#7B7B7B' }}>John Miller</Text>
                        </View>
                        <View>
                            <Text style={{ ...theme.f_12, ...theme.pl_10, ...theme.pr_10, backgroundColor: '#00C406', ...theme.br_50, ...theme.white }} >COMPLETED</Text>
                        </View>
                    </View>
                    {/* ROW */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <View style={{ ...theme.row, ...theme.align_center }}>
                            <Icon
                                name='package'
                                type='feather'
                                color='#449284'
                                size={36}
                            />
                            <Text style={{ ...theme.f_20, color: '#7B7B7B', ...theme.pl_5 }}>343434</Text>
                        </View>
                        <View style={{ ...theme.align_center }}>
                            <Text style={{ ...theme.f_20, color: '#7B7B7B', ...theme.pl_5, ...theme.align_center }}>CAD 20</Text>
                        </View>
                    </View>

                </View>
            </View>
        </View>

    )
}
