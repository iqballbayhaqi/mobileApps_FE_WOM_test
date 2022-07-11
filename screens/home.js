import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  Button,
  View,
  Alert,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SelectDropdown from "react-native-select-dropdown";
import ListCustomer from "../components/ListCustomer";
import { useIsFocused } from "@react-navigation/native";

export default function App({ navigation }) {
  const baseUrl = "http://192.168.0.102:3000"
  const [tenorList, setTenorList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [listCust, setListCust] = useState([]);
  const [dataNewCustomer, setDataNewCustomer] = useState({
    first_name: "",
    last_name: "",
    phone_no: "",
    branch_id: "",
    product_id: "",
    tenor_id: "",
    avatar: "",
  });
  const [notif, setNotif] = useState(0);
  const [refresh, setRefresh] = useState();

  const onChangeDataNewCust = ({ value, key }) => {
    if (key === "branch_id") {
      setDataNewCustomer({
        ...dataNewCustomer,
        [key]: branchList.find((val) => val.branch_name === value).id,
      });
    } else if (key === "product_id") {
      setDataNewCustomer({
        ...dataNewCustomer,
        [key]: productList.find((val) => val.product_name === value).id,
      });
    } else {
      setDataNewCustomer({
        ...dataNewCustomer,
        [key]: value,
      });
    }
  };

  const getDataBranch = () => {
    fetch(`${baseUrl}/GetMasterBranch`)
      .then((response) => response.json())
      .then((data) => setBranchList(data.data))
      .catch((error) => console.error(error));
  };

  const getDataProduct = () => {
    fetch(`${baseUrl}/GetMasterProduct`)
      .then((response) => response.json())
      .then((data) => setProductList(data.data))
      .catch((error) => console.error(error));
  };

  const getDataCustomer = () => {
    fetch(`${baseUrl}/GetAllDataCust`)
      .then((response) => response.json())
      .then((data) => setListCust(data.data))
      .catch((error) => console.error(error));
  };

  const notification = (status) => {
    setNotif(status);
    setTimeout(() => setNotif(0), 5000);
  };

  const saveDataCust = () => {
    const {
      first_name,
      last_name,
      phone_no,
      branch_id,
      product_id,
      tenor_id,
      avatar,
    } = dataNewCustomer;

    if (
      first_name.length !== 0 &&
      last_name.length !== 0 &&
      phone_no.length !== 0 &&
      branch_id.length !== 0 &&
      product_id.length !== 0 &&
      tenor_id.length !== 0
    ) {
      fetch(`${baseUrl}/SaveDataCust`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataNewCustomer),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.statusCode === 200) {
            notification(1);
          }
        })
        .then(() => {
          clearForm();
          getDataCustomer();
        })
        .catch((err) => {
          notification(2);
        });
    } else {
      notification(2);
    }
  };

  const deleteCustomer = (id) => {
    fetch(`${baseUrl}/UpdateDataCust`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: Number(id)
      })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.statusCode === 200) {
        notification(1);
      }
    })
    .then(() => {
      setRefresh(new Date());
    })
    .catch((err) => {
      notification(2);
    });
  }

  const clearForm = () => {
    setDataNewCustomer({
      first_name: "",
      last_name: "",
      phone_no: "",
      branch_id: "",
      product_id: "",
      tenor_id: "",
      avatar: "",
    });
  }

  useEffect(() => {
    let counter = [];
    for (let i = 0; i < 61; i++) {
      counter.push(i);
    }
    setTenorList(counter);

    setDataNewCustomer({
      ...dataNewCustomer,
      avatar: `https://i.pravatar.cc/50?u=${Math.floor(
        Math.random() * (100 - 0 + 1) + 0
      )}`,
    });

    getDataBranch();
    getDataProduct();
    getDataCustomer();
  }, [useIsFocused(), refresh]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.fullWidth}>
        <View style={{ marginHorizontal: 50 }}>
          <Text style={styles.title}>Form Data Customer</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            maxLength={30}
            keyboardType="default"
            onChangeText={(text) =>
              onChangeDataNewCust({ value: text, key: "first_name" })
            }
            value={dataNewCustomer.first_name}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            maxLength={30}
            keyboardType="default"
            onChangeText={(text) =>
              onChangeDataNewCust({ value: text, key: "last_name" })
            }
            value={dataNewCustomer.last_name}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            maxLength={13}
            keyboardType="numeric"
            onChangeText={(text) =>
              onChangeDataNewCust({ value: text, key: "phone_no" })
            }
            value={dataNewCustomer.phone_no}
          />

          <SelectDropdown
            buttonStyle={styles.dropDown}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            data={branchList.map((res) => res.branch_name)}
            onSelect={(selectedItem, index) => {
              onChangeDataNewCust({ value: selectedItem, key: "branch_id" });
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            renderDropdownIcon={(isOpened) => {
              return (
                <FontAwesome
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  color={"#444"}
                  size={13}
                />
              );
            }}
            dropdownIconPosition={"right"}
            defaultButtonText={"Select Branch"}
          />

          <SelectDropdown
            buttonStyle={styles.dropDown}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            data={productList.map((res) => res.product_name)}
            onSelect={(selectedItem, index) => {
              onChangeDataNewCust({ value: selectedItem, key: "product_id" });
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            renderDropdownIcon={(isOpened) => {
              return (
                <FontAwesome
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  color={"#444"}
                  size={13}
                />
              );
            }}
            dropdownIconPosition={"right"}
            defaultButtonText={"Select Product Name"}
          />

          <SelectDropdown
            buttonStyle={styles.dropDown}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            data={tenorList}
            onSelect={(selectedItem, index) => {
              onChangeDataNewCust({ value: selectedItem, key: "tenor_id" });
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            renderDropdownIcon={(isOpened) => {
              return (
                <FontAwesome
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  color={"#444"}
                  size={13}
                />
              );
            }}
            dropdownIconPosition={"right"}
            defaultButtonText={"Select Tenor"}
          />

          <View style={styles.button}>
            <Button color="#00aead" title="Submit" onPress={saveDataCust} />
          </View>

          <View style={styles.button}>
            <Button
              color="#019875"
              title="Clear Form"
              onPress={clearForm}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View>
          {listCust.map((res, idx) => (
            <View style={{ marginVertical: 10 }} key={idx}>
              <ListCustomer  data={res} navigation={navigation} deleteCustomer={deleteCustomer} />
            </View>
          ))}
        </View>

        <StatusBar style="auto" />
      </ScrollView>
      {notif === 1 ? (
        <View style={styles.alertWrapperSuccess}>
          <Text style={styles.alertTextSuccess}>Submit Success!</Text>
        </View>
      ) : notif === 2 ? (
        <View style={styles.alertWrapperError}>
          <Text style={styles.alertTextError}>Submit Error!</Text>
        </View>
      ) : (
        <View />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: StatusBar.currentHeight,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderBottomWidth: 1,
  },
  dropDown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    margin: 14,
    width: 210,
    borderRadius: 5,
    height: 40,
  },
  dropdown1BtnTxtStyle: {
    fontSize: 12,
  },
  button: {
    margin: 12,
  },
  alertWrapperSuccess: {
    backgroundColor: "rgb(114,204,80)",
    width: "100%",
    padding: 10,
    margin: 1,
    borderRadius: 5,
  },
  alertTextSuccess: {
    color: "#114b5f",
  },
  alertWrapperError: {
    backgroundColor: "pink",
    width: "100%",
    padding: 10,
    margin: 1,
    borderRadius: 5,
  },
  alertTextError: {
    color: "red",
  },
  divider: {
    backgroundColor: "#000",
    height: 2,
    width: "100%",
    marginVertical: 10,
  },
  fullWidth: {
    width: "100%",
  },
});
