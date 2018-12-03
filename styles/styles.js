import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    textAlignVertical: 'center'
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20
  },
  dateRow: {
    backgroundColor: '#dadada'
  }
});

export const triangles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'grey'
  },
  triangleLeft: {
    transform: [
      {rotate: '-90deg'}
    ]
  },
  triangleRight: {
    transform: [
      {rotate: '90deg'}
    ]
  }
});