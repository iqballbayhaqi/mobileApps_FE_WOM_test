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

export default function Update({ navigation, route }) {
  const baseUrl = "http://192.168.0.102:3000";
  const {
    first_name,
    last_name,
    phone_no,
    branch_id,
    product_id,
    tenor_id,
    avatar,
  } = route.params;
  const [tenorList, setTenorList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [dataCustomer, setDataCustomer] = useState({
    first_name: first_name,
    last_name: last_name,
    phone_no: phone_no,
    branch_id: branch_id,
    product_id: product_id,
    tenor_id: tenor_id,
  });
  const [notif, setNotif] = useState(0);

  const onChangeDataNewCust = ({ value, key }) => {
    if (key === "branch_id") {
      setDataCustomer({
        ...dataCustomer,
        [key]: branchList.find((val) => val.branch_name === value).id,
      });
    } else if (key === "product_id") {
      setDataCustomer({
        ...dataCustomer,
        [key]: productList.find((val) => val.product_name === value).id,
      });
    } else {
      setDataCustomer({
        ...dataCustomer,
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

  const notification = (status) => {
    setNotif(status);
    setTimeout(() => setNotif(0), 5000);
  };

  const saveDataCust = () => {
    fetch(`${baseUrl}/UpdateDataCust?id=${route.params.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataCustomer),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          notification(1);
        }
      })
      .catch((err) => {
        notification(2);
      });
  };

  const backToHome = () => {
    navigation.navigate("Home");
  };

  useEffect(() => {
    let counter = [];
    for (let i = 0; i < 61; i++) {
      counter.push(i);
    }
    setTenorList(counter);

    getDataBranch();
    getDataProduct();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.fullWidth}>
        <View style={{ marginHorizontal: 50 }}>
          <Text style={styles.title}>Update Data Customer</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            maxLength={30}
            keyboardType="default"
            onChangeText={(text) =>
              onChangeDataNewCust({ value: text, key: "first_name" })
            }
            value={dataCustomer.first_name}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            maxLength={30}
            keyboardType="default"
            onChangeText={(text) =>
              onChangeDataNewCust({ value: text, key: "last_name" })
            }
            value={dataCustomer.last_name}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            maxLength={13}
            keyboardType="numeric"
            onChangeText={(text) =>
              onChangeDataNewCust({ value: text, key: "phone_no" })
            }
            value={String(dataCustomer.phone_no)}
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
            <Button color="#00aead" title="Update" onPress={saveDataCust} />
          </View>

          <View style={styles.button}>
            <Button color="#019875" title="Back" onPress={backToHome} />
          </View>
        </View>

        <StatusBar style="auto" />
      </ScrollView>
      {notif === 1 ? (
        <View style={styles.alertWrapperSuccess}>
          <Text style={styles.alertTextSuccess}>Update Success!</Text>
        </View>
      ) : notif === 2 ? (
        <View style={styles.alertWrapperError}>
          <Text style={styles.alertTextError}>Update Error!</Text>
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
    fontSize: 23,
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
