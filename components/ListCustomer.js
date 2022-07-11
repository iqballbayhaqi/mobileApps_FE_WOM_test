import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Modal,
  Button,
  View,
  Image,
  Pressable,
} from "react-native";

const ListCustomer = ({ data, navigation, deleteCustomer }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.cardImgAndDetail}>
        <View>
          <Image
            source={{
              uri: data.avatar,
            }}
            style={{ height: 100, width: 100 }}
          />
        </View>
        <View style={styles.cardDetail}>
          <Text
            style={styles.cardName}
            onPress={() => navigation.navigate("Update", data)}
          >{`${data.first_name} ${data.last_name}`}</Text>
          <Text>{`Branch Name : ${data.m_branch.branch_name}`}</Text>
          <Text>{`Product Name : ${data.m_product.product_name}`}</Text>
          <Text>{`Tenor : ${data.tenor_id}`}</Text>
        </View>
      </View>
      <View>
        <View style={styles.cardDeleteWrapper}>
          <Text
            style={styles.cardDeleteText}
            onPress={() => setModalVisible(true)}
          >
            X
          </Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headModal}>
              <Text style={styles.modalTitle}>Confirmation</Text>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.modalCloseX}>X</Text>
              </Pressable>
            </View>
            <View>
              <Text style={styles.modalText}>Confirm to Delete ?</Text>
            </View>
            <View style={styles.actionModal}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancle</Text>
              </Pressable>
              <View style={{ marginLeft: 10 }}>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => {
                    deleteCustomer(data.id);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Yes, Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardImgAndDetail: {
    flexDirection: "row",
  },
  cardDetail: {
    marginLeft: 10,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardDeleteWrapper: {
    backgroundColor: "red",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  cardDeleteText: {
    color: "#fff",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    // padding: 35,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "grey",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginVertical: 50,
    textAlign: "left",
    color: "#019875",
  },
  headModal: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  actionModal: {
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-end",
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#019875",
  },
  modalCloseX: {
    backgroundColor: "#fff",
  },
});

export default ListCustomer;
