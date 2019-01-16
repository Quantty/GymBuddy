import React from 'react';
import { Text, View, ScrollView, TouchableOpacity ,Picker,Button,Image,TextInput,Alert} from 'react-native';
import { styles } from '../styles/styles';
import { profileSchema, foodSchema } from '../database/schemas';
import Realm from 'realm';
import images from '../images';


export default class Exercise extends React.Component {
    static navigationOptions = {
        title: 'Exercise',
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
            name: '',
            series: [],
            details: "",
        }
    }
    componentDidMount(){
        const { navigation } = this.props;
        const exercise = navigation.getParam('object', null);
        if(exercise){
            this.setState({
                name: exercise.name,
                series: exercise.series,
                details: exercise.details,
            })
        }
    }
    save =()=>{
        const { navigation } = this.props;
        var stateCopy = {...this.state}
        const saveData = navigation.getParam('saveExercise', null);
        const ind = navigation.getParam('index1', null);
        saveData(stateCopy,ind)
        navigation.goBack()
    }
    setSeries=(value)=>{
        var array = ((value!==undefined)? value.split(",").map(Number):[])
        this.setState({series: array})
    }
    setKey =(key,data)=>{
        if(key==="name"){
            this.setState({name: data})
        }else{
            this.setState({details: data})
        }
    }
    render(){
        const textInput = (key, placeholder) => 
            <TextInput
                key={key+placeholder}
                style={[styles.textInput, styles.height, styles.margins, styles.font18, key==="details"?styles.height100:'']}
                onChangeText={value => this.setKey(key, value)}
                value={(key==="name")?this.state.name: this.state.details}
                placeholder={placeholder}
                multiline = {true}
                numberOfLines={key==="details"?5:1}
            />;
        const textInputList = (data) => 
            <TextInput
                key={"23"}
                style={[styles.containerBox2, styles.height, styles.margins, styles.font18,{flex: 1}]}
                onChangeText={value => this.setSeries(value)}
                keyboardType= {'numeric'}
                maxLength = {25}
                value={data}
            />;
        return(
            <ScrollView>
                <View style={[styles.container, styles.margins]}>
                    <View style={styles.column}>
                        <Text style={[styles.height, styles.margins,styles.font18]}>Title:</Text>
                        <Text style={[styles.height, styles.margins, styles.font18]}>Series:</Text>
                    </View>
                    <View style={[{flex: 1}, styles.column]}>
                        {textInput('name', 'Insert a title')}
                        {textInputList(this.state.series.toString())}
                    </View>
                </View>
                <View style= {styles.containerBox}>
                    <View style = {[{borderBottomWidth: 0.7},styles.row,{flex: 1},{alignSelf: 'flex-start'}]}>
                        <Text style={[styles.font18,{flex: 1}]}>Media:</Text>
                    </View>
                    <View style = {[styles.row,{flex: 1},{alignSelf: 'flex-start'}]}>
                        <Text style={[styles.font18,{flex: 1}]}>Placeholder for images/ gifs:</Text>
                        <Image style={{width: 250, height: 150}} source = {images.benchPress} />
                    </View>
                </View>
                <View style= {styles.containerBox}>
                    <View style = {[{borderBottomWidth: 0.7},styles.row,{flex: 1},{alignSelf: 'flex-start'}]}>
                        <Text style={[styles.font18,{flex: 1}]}>Details:</Text>
                    </View>
                    <View style = {[{borderBottomWidth: 0}, styles.containerBox2]}>
                        {textInput('details',"Insert details")}
                    </View>
                </View>
                <View style = {styles.marginsLeftRight}>
                    <Button 
                        onPress={this.save}
                        title="Save"
                        color="#06A77D"
                    />
                </View>
            </ScrollView>
        )
    }
}