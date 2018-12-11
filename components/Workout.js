import React from 'react';
import { Text, View, ScrollView, TouchableOpacity ,Picker,Button,Image,TextInput} from 'react-native';
import {Badge} from 'react-native-elements';
import { styles } from '../styles/styles';
import { profileSchema, foodSchema } from '../database/schemas';
import Realm from 'realm';
import images from '../images';


export default class Workout extends React.Component {
    static navigationOptions = {
        title: 'Workout Plan',
        headerTitleStyle: {
          fontWeight: 'bold'
        },
        headerStyle: {
          backgroundColor: '#00A6FB'
        }
      }
    constructor(props) {
        super(props);
        this.state = {
            new: true,
            title: '',
            day: 'Monday',
            exercises: []
        }
    }
    componentDidMount(){
        const { navigation } = this.props;
        const workout = navigation.getParam('item', null);
        if(workout){
            this.setState({
                title: workout.title,
                day: workout.day,
                exercises: [...workout.exercises],
                new: false
            })
        }
    }
    setKey=(value,index,key)=>{
        const list = [...this.state.exercises]
        if(key === 'name'){
            list[index].name = value
        }else{
            var array = ((value!==undefined)? value.split(","):[])
            list[index].series = array
        }
        this.setState({exercises: list})
    }
    save =()=>{
        if(this.state.new){

        }else{

        }
    }
    addRow=()=>{
        var list = [...this.state.exercises]
        list.push({name:'',series:[]})
        this.setState({exercises: list})
    }
    render(){
        const textInput = (key, placeholder) => 
            <TextInput
                key={key}
                style={[styles.textInput, styles.height, styles.margins, styles.font18]}
                onChangeText={value => this.setState({
                    title: value
                })}
                value={this.state.title}
                placeholder={placeholder}
            />;
        const textInputList = (data, index, key) => 
            <TextInput
                key={index+data}
                style={[styles.height, styles.margins, styles.font18,{width:'50%'},styles.containerBox2]}
                onChangeText={value => this.setKey(value,index,key)}
                keyboardType= {(key==='series'?'numeric':'default')}
                multiline ={true}
                editable = {true}
                maxLength = {25}
                caretHidden = {false}
                numberOfLines = {2}
                value={data}
            />;
        return(
            <ScrollView>
                <View style={[styles.container, styles.margins]}>
                    <View style={styles.column}>
                        <Text style={[styles.height, styles.margins,styles.font18]}>Title:</Text>
                        <Text style={[styles.height, styles.margins, styles.font18]}>Day of the week:</Text>
                    </View>
                    <View style={[{flex: 1}, styles.column]}>
                        {textInput('Title', 'Insert a title')}
                        <View style={styles.containerBox2}>
                            <Picker
                                selectedValue={this.state.day}       
                                onValueChange={itemValue => this.setState({day: itemValue})}
                            >
                                <Picker.Item label='Monday' value={'Monday'}/>
                                <Picker.Item label='Tuesday' value={"Tuesday"}/>
                                <Picker.Item label='Wednesday' value={"Wednesday"}/>
                                <Picker.Item label='Thursday' value={"Thursday"}/>
                                <Picker.Item label='Friday' value={"Friday"}/>
                                <Picker.Item label='Saturday' value={"Saturday"}/>
                                <Picker.Item label='Sunday' value={"Sunday"}/>
                            </Picker>
                        </View>     
                    </View>
                </View>
                <View style={{alignSelf: 'center'}}>
                    <Text style={[styles.height, styles.alignText, styles.margins,styles.font18]}>Exercise List:</Text>
                </View>
                <View style= {styles.containerBox}>
                    <View style={[ styles.margins,{paddingHorizontal: 10}]}>
                        <View style = {[{borderBottomWidth: 0.7},styles.row,{flex: 1},{alignSelf: 'center'}]}>
                            <Text style={[styles.height, styles.margins,styles.font18,{width:'50%'}]}>Name:</Text>
                            <Text style={[styles.height, styles.margins, styles.font18,{width:'50%'}]}>Series:</Text>
                        </View>
                        {this.state.exercises.map((element, index)=>{
                            return(
                                <View style = {[{borderBottomWidth: 0.7},styles.row,
                                    {flex: 1},{alignSelf: 'center'}]} key ={index}>
                                    {textInputList(element.name, index, 'name')}         
                                    {textInputList(element.series.toString(), index, 'series')}
                                </View>
                            )
                        })}
                    </View>
                    <View style={[{width:'30%'}, styles.margins, {alignSelf: 'center'}]}>
                        <Button
                            onPress={e => this.addRow()}
                            title="Add Row"
                            color="#841584"
                        />
                    </View>
                </View>
                <Button
                    onPress={this.save}
                    title="Save"
                    color="#06A77D"
                />
            </ScrollView>
        )
    }
}