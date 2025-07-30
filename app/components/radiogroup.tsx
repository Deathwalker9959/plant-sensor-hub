import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles from '../common/styles';

// A reusable radio group component for selecting options.
// Supports preselection and triggers a callback on value change.

export interface RadioOption {
  label: string;
  value: any;
}

interface RadioGroupProps {
  options: RadioOption[];
  onValueChange?: (value: string) => void;
  fieldName?: string;
  preselected?: any;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  onValueChange,
  fieldName,
  preselected
}) => {
  const [selectedValue, setSelectedValue] = useState<any>(preselected);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <View style={styles.container}>
      {fieldName && <Text style={styles.fieldName}>{fieldName}</Text>}
      {options.map((option, index) => (
        <React.Fragment key={index}>
          {index > 0 && <View style={globalStyles.divider} />}
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => handleSelect(option.value)}
          >
            <Text style={styles.optionLabel}>{option.label}</Text>
            <View style={selectedValue === option.value ? styles.radioSelected : styles.radioUnselected}>
              {selectedValue === option.value && <View style={styles.innerCircle} />}
            </View>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    margin: 10,
    width:"100%",
    display:"flex",
  },
  fieldName: {
    fontSize: 16,
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioSelected: {
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: globalStyles.submitButton.backgroundColor,
    marginRight: 10,
  },
  innerCircle: {
    height: "80%",
    width: "80%",
    borderRadius: 10,
    backgroundColor: globalStyles.submitButton.backgroundColor,
  },
  radioUnselected: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    marginRight: 10,
  },
  optionLabel: {
    fontSize: 16,
    flexGrow: 1,
  },
});

export default RadioGroup;
