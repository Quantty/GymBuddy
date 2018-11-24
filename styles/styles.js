import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  column: {
    flexDirection: 'column'
  }, 
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center'
  },  
  rowIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  row: {
    flexDirection: 'row'
  },
  textInput: {
    borderColor: 'grey',
    borderBottomWidth: 2,
    borderRadius: 10
  },
  height: {
    height: 40,
    padding: 5
  },
  margins: {
    margin: 10
  },
  alignText: {
    textAlignVertical: 'bottom'
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20
  }
});