import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert  } from 'react-native';
import { Header, Input, Button, Icon, ListItem } from'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppinglistItem, setShoppinglistItem] = useState([]);

  const db  = SQLite.openDatabase('shoppinglistdb.db');

  useEffect(()=> {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id  integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  const updateList = () => {
    db.  transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows})   => 
      setShoppinglistItem(rows._array)); 
    });
  }

  const deleteItem = (id) => {
    Alert.alert('are you sure?')
    db.transaction(tx =>  {
        tx.executeSql(`delete from shoppinglist where id = ?;`, [ id]);
    }, null, updateList)
    console.log('mitävittua')  
    
  }


  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppinglist(product,amount)values(?,?);',
        [product, amount]);
      }, null, updateList
    )
    console.log(shoppinglistItem)
    setProduct('');
    setAmount('');
  }
  
  return (
    <SafeAreaProvider>
    <View style={styles.container}>
      <Header
      centerComponent={{ text:'SHOPPINGLIST', style:{ color: '#fff' } }} 
      />
      <Input 
      placeholder='Product' 
      label='PRODUCT'
      onChangeText={product=> setProduct(product)}
      value={product}/>
      <Input 
      placeholder='Amount' 
      label='AMOUNT'
      onChangeText={amount=> setAmount(amount)}
      value={amount}
      />
      <Button
      raised icon={{name: 'save'}} 
      onPress={saveItem}title="SAVE"/>
      <FlatList
      style={{width: 200}}
      ListHeaderComponent= {<Text >Shopping list</Text>}
      keyExtractor={item=> item.id.toString()}
      data={shoppinglistItem }
      renderItem={({item}) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <View style ={{flexDirection:'row', justifyContent: 'center'}}>
                <View>
              <ListItem.Title>{item.product}</ListItem.Title>
              <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
              </View>
              <Button type='clear' icon={<Icon name='delete' color='red'/>} onPress={() => deleteItem(item.id)} />
              </View>
            </ListItem.Content>
          </ListItem>)
      }
      />
      <StatusBar style="auto" />
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
