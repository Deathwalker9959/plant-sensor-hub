import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    position: "absolute",
    top: 70,
    fontFamily: "Inter",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  input: {
    height: 50,
    marginVertical: 10,
    width: "80%",
    borderRadius: 4,
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    padding: 10
  },
  submitButton: {
    width: "100%",
    height: 50,
    borderRadius: 100,
    backgroundColor: "#5DB075",
    justifyContent: "center",
    alignSelf: "center",
  },
  submitText: {
    width: "100%",
    color: "white",
    textAlign: "center",
    fontWeight: "300",
    fontSize: 16,
    fontFamily: "Inter",
  },
  textPrimary: {
    color: "#5DB075",
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "bold",
  },
  closeBtn: {
    position: "absolute",
    top: 80,
    left: 40,
  },
});

export default styles;
