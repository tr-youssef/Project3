import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { auth } from "../../utils/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { token,setToken, callAPI } from "../../utils/fetch/callAPI";
import { colors } from "../../utils/theme/theme.js";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });
  });

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const validatePassword = () => {
    // return String(password).length >= 6;
    if (String(password).length < 6) {
      alert("Invalid password.  Must be at least 6 characters");
      passwordRef.current?.focus();
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(email);
    if (!re.test(email)) {
      alert("Invalid email address");
      emailRef.current?.focus();
      return false;
    }
    return true;
  };

  const handleSignUp = () => {
    if (!validateEmail()) {
      return;
    }

    if (!validatePassword()) {
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;

        callAPI("/api/users/signup", "POST", {
          email: user.email,
          password: user.passsword,
        }).then((resp) => {
          setToken(resp.token);
        });
      })
      .catch((error) => alert(error.message));
  };

  const handleLogin = () => {
    if (!validateEmail(email)) {
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        userCredentials.password = password; //add the password so we can call our SignIn
        return userCredentials;
      })
      .then((userCredentials) => {
        callAPI("/api/users/signin", "POST", {
          email: userCredentials._tokenResponse.email,
          password: userCredentials.password,
        })
          .then((resp) => {
            setToken(resp.token);
            console.log(token);
            navigation.navigate("Home");
          })
          .catch((error) => alert("signin error: " + error));
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          value={email}
          type={email}
          ref={emailRef}
          keyboardType="email-address"
          blurOnSubmit={false}
          onBlur={(e) => {
            validateEmail(email);
          }}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          ref={passwordRef}
          value={password}
          minLength={4}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
          onBlur={(e) => {
            validatePassword(password);
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050A05",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: colors.dark.greenElec,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: colors.dark.greenElec,
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: colors.dark.greenElec,
    fontWeight: "700",
    fontSize: 16,
  },
});
