import React from 'react';
import { Text, View, ScrollView, TouchableOpacity ,Picker,Button,Image, Alert} from 'react-native';
import { styles } from '../styles/styles';
import { workoutSchema, exerciseSchema } from '../database/schemas';
import Realm from 'realm';
import images from '../images';
import Workout from './Workout';


export default class Fitness extends React.Component {
    static navigationOptions = {
        header: null
      }
    constructor(props) {
        super(props);
        this.state = {
            countId : null,
            realm: null,
            workoutList: []
        }
    }

    componentDidMount(){
        //  this.resetDb()
        //  this.writeToDb()
        this.readAll() 
    }
    resetDb=()=>{
        Realm.deleteFile({schema:[exerciseSchema, workoutSchema]})
    }
    readAll=()=>{
        Realm.open({
            schema: [exerciseSchema, workoutSchema]
          }).then(realm => {
                console.log("reading the list");
                var list = realm.objects('Workout')
                this.setState({workoutList: list,
                realm : realm, countId: list.length})
          });
    }
    makeId=()=>{
        var nr = this.state.countId
        nr = nr + 1
        this.setState({countId: nr})
        return nr
    }
    writeToDb=()=>{
        Realm.open({
            schema: [workoutSchema, exerciseSchema]
          }).then(realm => {
              console.log("open & write");
              
            realm.write(() => {
              realm.create('Workout', {
                    id: this.makeId(),
                    title: 'Chest Day',
                    day:'Monday',
                    showEx: false,
                    exercises: [{name:'Bench Press', series:[12,10,8,6]},
                                {name:'Machine Decline Press', series:[10,9,7]},
                                {name: "Incline Bench Cable Fly", series:[10,9,8]}]
                });
                realm.create('Workout', {
                    id: this.makeId(),
                    title: 'Shoulders',
                    day: 'Tuesday',
                    showEx: false,
                    exercises: [{name:'Cable Reverse Flye', series:[12,10,8]},
                                {name:'Push Press', series:[10,9,8]}]})
            });
            realm.close();
          });
    }

    addWorkoutItem=(item)=>{
        var myRealm = this.state.realm
        myRealm.write(()=>{
            myRealm.create('Workout',{id: this.makeId(), day: item.day, title: item.title, 
                                    showEx: false, exercises: item.exercises}, true)
        })
        this.setState({workoutList : myRealm.objects('Workout')})
    }
    editWorkoutItem=(item, index)=>{
        var myRealm = this.state.realm
        myRealm.write(()=>{
            myRealm.create('Workout',{id: item.id, day: item.day, title: item.title, 
                                    showEx: false, exercises: item.exercises}, true)
        })
        this.setState({workoutList : myRealm.objects('Workout')})
    }
    deleteWorkout=(item)=>{
        Alert.alert(
            'Confirmation',
            'Delete this item ?',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => {
                var myRealm = this.state.realm
                myRealm.write(()=>{
                    let obj = myRealm.create('Workout',{id: item.id}, true)
                    myRealm.delete(obj)
                })
                this.setState({workoutList : myRealm.objects('Workout')})
              }},
            ],
            { cancelable: true }
          ) 
    }
    addWorkout=()=>{
        const { navigate } = this.props.navigation;
        navigate('Workout',{addData: this.addWorkoutItem})
    }
    editWorkout=(item,index)=>{
        const { navigate } = this.props.navigation;
        navigate('Workout',{object: item, index: index, saveData: this.editWorkoutItem})
    }
    hideShow=(item)=>{
        var list = [...this.state.workoutList]
        list.forEach(elem =>{
            if(elem === item){
                elem.showEx = !elem.showEx
            }
        })
        this.setState({workoutList : list})
    }
    setDay=(item, day)=>{
        var myRealm = this.state.realm
        myRealm.write(()=>{
            myRealm.create('Workout',{id: item.id, day: day}, true)
        })
        this.setState({workoutList : myRealm.objects('Workout')})
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
                        <Text style={[{fontSize: 18},{textAlign:'center'},{borderBottomWidth:1}]}>Exercises </Text>
                    </TouchableOpacity>
                    <View style={{alignSelf:'center'}}>
                    <Image style={{width: 13, height: 13}} source = {images.down} /></View>
                    {/* <Badge
                            value={item.exercises.length}
                            containerStyle={{ backgroundColor: 'lightgrey'}}
                            textStyle={{ color: 'orange' }}
                        /> */}
                </View>
                {item.showEx?
                    item.exercises.map((ex,ind)=>{
                    return( <Text style={[{fontSize: 16},{textAlign:'center'}]} key = {ind}>{ex.name} {ex.series.toString()}</Text>);
                    }):<Text/>
                }
                <View style = {styles.row}>
                 <View style={[{ width: "15%", alignSelf: 'flex-start',flex: 1}]}>
                    <TouchableOpacity  onPress={e =>this.deleteWorkout(item)}>
                        <View style={{padding: 1}}>
                            <Image style={{width: 25, height: 25}} source = {images.delete} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[{ width: "15%", alignSelf: 'flex-end', flex: 1}]}>
                    <TouchableOpacity  onPress={e =>this.editWorkout(item,index)}>
                        <Text style={[{color:'black'},{backgroundColor: '#FFFD77'},{alignSelf: 'flex-end'},
                                        {padding: 5},{fontSize: 16},{fontStyle: 'normal'}]}>Edit </Text>
                    </TouchableOpacity>
                </View>
                </View>
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
        console.log(list);
        
        return (<View style={{flex:1}}>
                    {header}
                    
                    <ScrollView style={styles.marginsLeftRight}>
                        {list.map((item, index) =>
                                this.printElement(item, index)
                        )}
                        {this.state.workoutList[0]?
                         <View style={[styles.margins, styles.marginsLeftRight]}>
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