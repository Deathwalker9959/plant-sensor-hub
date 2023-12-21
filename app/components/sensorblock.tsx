import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

interface SensorBlockProps {
    sensorName: string;
    sensorValue: string;
    sensorIcon: ReactNode; // ReactNode allows any valid React element
  }
  

  const SensorBlock: React.FC<SensorBlockProps> = ({ sensorName, sensorValue, sensorIcon }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.sensorName}>{sensorName}</Text>
      
      <View style={styles.sensorIcon}>
        {sensorIcon}
      </View>
      
      <Text style={styles.sensorValue}>{sensorValue}</Text>
    </View>
  );
};

export default SensorBlock;

const styles = StyleSheet.create({
  container: {
    width: 104,
    height: 183,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    background: 'white',
    borderRadius: 10,
    border: '1px solid #E8E8E8',
  },
  sensorName: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Nokora',
    fontWeight: '400',
  },
  sensorIcon: {
    width: 52,
    height: 52,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sensorValue: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'Montserrat',
    fontWeight: '400',
  }
});
