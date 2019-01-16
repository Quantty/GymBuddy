import React from 'react';
import { Text, View, ScrollView, TouchableOpacity ,Picker,Button,Image,TextInput,Alert} from 'react-native';
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
        const workout = navigation.getParam('object', null);
        if(workout){
            this.setState({
                id: workout.id,
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
            var array = ((value!==undefined)? value.split(",").map(Number):[])
            list[index].series = array
        }
        this.setState({exercises: list})
    }
    save =()=>{
        const { navigation } = this.props;
        var stateCopy = {...this.state}
        var workout = {
            id: stateCopy.id,
            title: stateCopy.title,
            day: stateCopy.day,
            exercises: stateCopy.exercises
        }
        if(!this.state.new){
            const saveData = navigation.getParam('saveData', null);
            const indx = navigation.getParam('index', null);
            saveData(workout,indx)
            navigation.goBack()
        }else{
            const saveData = navigation.getParam('addData', null);
            saveData(workout)
            navigation.goBack()
        }
    }
    saveExercise=(exercise,index)=>{
        var newL = this.state.exercises
        newL[index] = exercise
        this.setState({exercise: newL})
    }
    editExercise=(element,index)=>{
        const { navigate } = this.props.navigation;
        navigate('Exercise',{object: element, index1: index, saveExercise: this.saveExercise})
    }
    addRow=()=>{
        var list = [...this.state.exercises]
        list.push({name:'',series:[]})
        this.setState({exercises: list})
    }
    deleteExercise=(index)=>{  
        Alert.alert(
            'Confirmation',
            'Delete this item ?',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => {
                var list = this.state.exercises
                list.splice(index,1)
                this.setState({exercises: list})
              }},
            ],
            { cancelable: true }
          )
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
                key={index+key}
                style={[styles.height, styles.margins, styles.font18,{flex: key==='series'?0.30:0.65},styles.containerBox2]}
                onChangeText={value => this.setKey(value,index,key)}
                keyboardType= {(key==='series'?'numeric':'default')}
                maxLength = {25}
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
                    <View style = {[{borderBottomWidth: 0.7},styles.row,{flex: 1},{alignSelf: 'center'}]}>
                        <Text style={[styles.height, styles.margins,styles.font18,{flex: 0.65}]}>Name:</Text>
                        <Text style={[styles.height, styles.margins, styles.font18,{flex: 0.30}]}>Series:</Text>
                    </View>
                    {this.state.exercises.map((element, index)=>{
                        return(
                            <View style = {[styles.containerBox,styles.row,{padding: 0},{margin: 3},{flex: 1}]} key ={index}>
                                {/* {textInputList(element.name, index, 'name')}         
                                {textInputList(element.series.toString(), index, 'series')} */}
                                <TouchableOpacity  onPress={e =>this.editExercise(element, index)} style = {{flex : 1}}>
                                    <View style={[styles.dateRow, styles.row, {padding: 7}]}>
                                        <Text style={{fontSize: 18}}>{element.name?element.name:"New Exercise"} ::  {element.series.toString()}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={[{ alignSelf: 'center' }]}>
                                    <TouchableOpacity  onPress={() =>this.deleteExercise(index)}>
                                        <View style={{padding: 1}}>
                                            <Image style={{width: 25, height: 25}} source = {images.delete} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })}
                    <View style={[{flex: 0.3}, styles.margins, {alignSelf: 'center'}]}>
                        <Button
                            onPress={e => this.addRow()}
                            title="Add Row"
                            color="#841584"
                        />
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