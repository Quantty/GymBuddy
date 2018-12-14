import React from 'react';
import { View, Text } from 'react-native'; 

export const presentFood = (item, padding = 10, grams = 100, flex = 0.9) => 
        <View style={{padding, flex}}>
          <Text style={{fontSize: 16, fontWeight: '400'}}>{item.name}</Text>
          <Text>P: {item.protein} g, C: {item.carbs} g, F: {item.fat} g, kcal: {item.calories}, grams: {grams}</Text>
        </View>