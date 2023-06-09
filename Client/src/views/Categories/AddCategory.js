import { StyleSheet, View } from "react-native";
import React, { useContext } from "react";
import { Icon } from "@rneui/themed";
import Input from "../../components/Input/Input.js";
import IconsSelector from "../../components/IconsSelector/IconsSelector.js";
import { callAPI } from "../../utils/fetch/callAPI.js";
import { useState } from "react";
import { CategoriesContext } from "../../utils/context/CategoriesContext.js";

const AddCategory = ({ navigation }) => {
  const categoryContext = useContext(CategoriesContext);
  const { setCategories } = categoryContext;
  const data = [
    { label: "Expense", value: "Expense" },
    { label: "Income", value: "Income" },
    { label: "Transfer", value: "Transfer" },
  ];
  const icons = ["fastfood", "home", "local-movies", "airplanemode-active", "payments", "compare-arrows"];
  const [choiceCategory, setChoiceCategory] = useState(icons[0]);
  const [name, setName] = useState("");
  const [type, setType] = useState(data.length > 0 ? data[0].value : "");

  const saveCategory = (name, type, choiceCategory) => {
    callAPI("http://localhost:4001/api/categories/parent", "POST", { name: name, type: type, icon: choiceCategory }, token)
      .then(async () => {
        await callAPI("http://localhost:4001/api/categories/parents", "GET", "", token).then((res) => setCategories(res));
        navigation.navigate("Categories");
      })
      .catch((error) => {
        console.error("Error saving category:", error);
      });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add Category",

      headerRight: () => <Icon name="save" type="MaterialIcons" onPress={() => saveCategory(name, type, choiceCategory)} />,
    });
  }, [navigation, name, type, choiceCategory]);

  return (
    <View style={styles.container}>
      <Input label={"Name :"} value={name} setValue={setName} />
      <Input label={"Type :"} datalist={data} value={type} setValue={setType} />
      <IconsSelector choiceCategory={choiceCategory} setChoiceCategory={setChoiceCategory} icons={icons} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050A05",
    alignItems: "center",
  },
});

export default AddCategory;
