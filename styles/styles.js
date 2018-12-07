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
    borderBottomWidth: 1
  },
  height: {
    height: 40,
    padding: 5
  },
  margins: {
    margin: 10
  },
  marginsLeftRight: {
    marginLeft: 10,
    marginRight: 10
  },
  alignText: {
    textAlignVertical: 'center'
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20
  },
  dateRow: {
    backgroundColor: '#dcdcdc'
  },
  progressBar: {
    height: 10,
    borderRadius: 50,
    minWidth: 10
  },
  filler: {
    borderRadius: 50,
    height: 10
  },
  borderLeft: {
    borderColor: 'black',
    borderLeftWidth: 1
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
    borderBottomColor: 'black'
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