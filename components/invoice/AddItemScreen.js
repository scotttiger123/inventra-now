import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddItemScreen = ({ navigation, route }) => {
  const { addItemToList = () => {} } = route.params || {};

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [isPercentage, setIsPercentage] = useState(true);
  const [uom, setUOM] = useState('');
  const [uomOptions] = useState(['kg', 'liters', 'pieces', 'packs']);
  const [filteredUOMOptions, setFilteredUOMOptions] = useState(uomOptions);
  const [uomVisible, setUOMVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSave = () => {

    if (
      productName.trim() === '' ||
      isNaN(quantity) ||
      isNaN(price) ||
      quantity <= 0 ||
      price <= 0 ||
      uom.trim() === ''
    ) {
      Alert.alert('Invalid Input', 'Please enter valid product details and select a UOM.');
      return;
    }

    let discountAmount = parseFloat(discount);
    if (isPercentage && discountAmount > 0) {
      discountAmount = (discountAmount / 100) * parseFloat(price);
    }

    addItemToList({
      name: productName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      discount: discountAmount,
      uom,
    });
    
    navigation.goBack();
  };

  const handleSaveAndNew = () => {
    if (
      productName.trim() === '' ||
      isNaN(quantity) ||
      isNaN(price) ||
      quantity <= 0 ||
      price <= 0 ||
      uom.trim() === ''
    ) {
      Alert.alert('Invalid Input', 'Please enter valid product details and select a UOM.');
      return;
    }

    let discountAmount = parseFloat(discount);
    if (isPercentage && discountAmount > 0) {
      discountAmount = (discountAmount / 100) * parseFloat(price);
    }

    addItemToList({
      name: productName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      discount: discountAmount,
      uom,
    });

    setProductName('');
    setQuantity('');
    setPrice('');
    setDiscount('');
    setUOM('');
    setSearchText('');
    setFilteredUOMOptions(uomOptions);
  };

  const filterUOMOptions = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = uomOptions.filter(option =>
        option.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUOMOptions(filtered);
    } else {
      setFilteredUOMOptions(uomOptions);
    }
  };

  const renderUOMOption = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setUOM(item);
        setUOMVisible(false);
        setSearchText('');
      }}
      style={styles.uomOptionContainer}
    >
      <Text style={styles.uomOption}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Product Name"
        value={productName}
        onChangeText={setProductName}
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Quantity"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Unit of Measure (UOM)</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setUOMVisible(!uomVisible)}
      >
        <Text style={styles.inputText}>{uom || 'Select UOM'}</Text>
      </TouchableOpacity>

      {uomVisible && (
        <View style={styles.uomDropdown}>
          <TextInput
            style={styles.uomSearchInput}
            placeholder="Search UOM"
            value={searchText}
            onChangeText={filterUOMOptions}
          />
          <FlatList
            data={filteredUOMOptions}
            renderItem={renderUOMOption}
            keyExtractor={(item) => item}
            style={styles.uomList}
          />
        </View>
      )}

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Discount in {isPercentage ? 'Percentage' : 'Value'}:</Text>
        <View style={styles.switchContainer}>
        <Switch
          value={isPercentage}
          onValueChange={setIsPercentage}
          trackColor={{ false: '#767577', true: '#808080' }} // Gray background when switched on
          thumbColor={isPercentage ? '#00FF00' : '#f4f3f4'} // Green thumb when switched on
        />
        </View>
      </View>
      <TextInput
        style={styles.input}
        placeholder={isPercentage ? 'Enter Discount (%)' : 'Enter Discount Value'}
        value={discount}
        keyboardType="numeric"
        onChangeText={setDiscount}
      />
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Icon name="save" size={12} color="#fff" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveAndNewButton} onPress={handleSaveAndNew}>
          <Icon name="plus" size={12} color="#fff" />
          <Text style={styles.buttonText}>Save & New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    transform: [{ scale: 0.8 }], // Adjust the scale factor as needed
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 12,
    
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    fontSize: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inputText: {
    fontSize: 12,
    color: '#333',
  },
  uomDropdown: {
    position: 'absolute',
    top: 160, // Adjust based on your layout
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  uomSearchInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    fontSize: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  uomList: {
    maxHeight: 150,
  },
  uomOptionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  uomOption: {
    padding: 10,
    fontSize: 12,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 10, // Adjust this value to position the footer slightly above the bottom of the screen
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  saveAndNewButton: {
    backgroundColor: '#25D366',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    textTransform: 'uppercase',
  },
});

export default AddItemScreen;
