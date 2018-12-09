import React from 'react';
import { Text, View, ScrollView, TouchableOpacity,Picker,Button,Image} from 'react-native';
import { Badge } from 'react-native-elements';
import { styles } from '../styles/styles';
import images from '../images';


export default class Fitness extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            workoutList: [
                {
                    title: 'Title',
                    day:'Monday',
                    exercises: [
                        {
                            name:'squats',
                            series:[12,10,8]
                        },
                        {
                            name:'biceps flex',
                            series:[10,9]
                        }],
                    showEx: false
                },
                {
                    title: 'Title2',
                    day: 'Tuesday',
                    exercises: [
                        {
                            name:'squats',
                            series:[12,10,8]
                        },
                        {
                            name:'biceps flex',
                            series:[10,9],
                        }],
                    showEx: true
                }
            ]
        }
    }
    addWorkout=()=>{
        
    }
    hideShow=(item)=>{
        var list = this.state.workoutList
        list.forEach(elem =>{
            if(elem === item){
                elem.showEx = !elem.showEx
            }
        })
        this.setState({workoutList : list})
    }
    setDay=(item, day)=>{
        var list = this.state.workoutList
        list.forEach(elem =>{
            if(elem === item){
                elem.day = day
            }
        })
        this.setState({workoutList : list})
    }
    printElement = (item,index)=>{
        return(
            <View style={styles.containerBox} key = {index}>
                <Text>Workout nr.{index + 1}</Text>
                <View style={[styles.row, styles.dateRow, {padding: 7}]}>
                    <Text style={{fontSize: 22}}>{item.title}</Text>
                </View>
                <View style={[styles.container, {marginHorizontal : 0}]}>
                   
                    <Text style={[styles.height,styles.column,{fontSize: 18}]}>Day of the week:</Text> 
                    <View style={[{flex:1}, styles.column,styles.containerBox2]}>
                        <Picker
                            selectedValue={item.day}       
                            onValueChange={itemValue => this.setDay(item, itemValue)}
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
                <View style={[styles.row, {alignSelf :'center'},{paddingTop:5}]}>
                    <TouchableOpacity  onPress={e =>this.hideShow(item)}>
                        <Text style={[{fontSize: 18},{textAlign:'center'},{borderBottomWidth:1}]}>Exercise List </Text>
                    </TouchableOpacity>
                    <View style={{alignSelf:'center'}}>
                    <Image style={{width: 13, height: 13}} source = {images.down} /></View>
                    <Badge
                            value={item.exercises.length}
                            style= {alignText='right'}
                            containerStyle={{ backgroundColor: 'lightgrey'}}
                            textStyle={{ color: 'orange' }}
                        />
                </View>
                {item.showEx?
                    item.exercises.map((ex,ind)=>{
                    return( <Text style={[{fontSize: 16},{textAlign:'center'}]} key = {ind}>{ex.name} {ex.series.toString()}</Text>);
                    }):<Text/>
                } 
            </View>
        )
    }
    render(){
       
        const textInfo =<View style={styles.alignText}>
                        <Text  style = {[styles.text,{textAlign:'center'}]}> This is your workout list.</Text>
                        <Text  style = {[styles.text, {fontSize: 18},{textAlign:'center'}]}>  Press the button bellow to add an entry!</Text>
                        </View>
        const addBtn = <Button
                            onPress={this.addWorkout}
                            title="Add New"
                            color="#841584"
                        />
        const header = <View style={[styles.row, styles.dateRow, {padding: 10}]}>
                            <Text style={{fontSize: 22}}>Fitness</Text>
                        </View>

        var list = this.state.workoutList
        return (<View>
                    {header}
                    
                    <ScrollView style={styles.marginsLeftRight}>
                        {list.map((item, index) =>{ 
                            return (
                                this.printElement(item, index)
                            );
                        })}
                        {this.state.workoutList[0]?
                         <View style={styles.marginsLeftRight}>
                            {addBtn}
                        </View>:
                         <View style={styles.containerBox}>
                            {textInfo}
                            {addBtn}
                        </View>
                        }
                    </ScrollView>
                </View>)
    }
}