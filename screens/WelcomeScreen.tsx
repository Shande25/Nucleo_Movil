import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../config/Config';

export default function WelcomeScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  function handleAuth() {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa un correo y una contraseña.');
      return;
    }

    if (isRegistering) {
      if (!username || !age || !country) {
        Alert.alert('Error', 'Todos los campos son obligatorios.');
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          set(ref(db, `users/${user.uid}`), {
            username,
            age,
            country,
            email
          })
            .then(() => {
              Alert.alert('Registro exitoso', `Bienvenido, ${username}`);
              setIsRegistering(false);
              setEmail('');
              setPassword('');
              setUsername('');
              setAge('');
              setCountry('');
            })
            .catch(() => Alert.alert('Error', 'No se pudo guardar la información.'));
        })
        .catch((error) => {
          let errorMessage = 'Ocurrió un error al registrarse.';
          if (error.code === 'auth/email-already-in-use') errorMessage = 'Este correo ya está en uso.';
          else if (error.code === 'auth/weak-password') errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
          else if (error.code === 'auth/invalid-email') errorMessage = 'El correo ingresado no es válido.';
          Alert.alert('Error', errorMessage);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          Alert.alert('Bienvenido', `Inicio de sesión exitoso como ${userCredential.user.email}`);
          navigation.navigate("Drawer");
        })
        .catch((error) => {
          let errorMessage = 'Ocurrió un error al iniciar sesión.';
          if (error.code === 'auth/wrong-password') errorMessage = 'Contraseña incorrecta.';
          else if (error.code === 'auth/user-not-found') errorMessage = 'No existe una cuenta con este correo.';
          Alert.alert('Error', errorMessage);
        });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Registro' : 'Login'}</Text>

      {isRegistering && (
        <>
          <TextInput
            placeholder='Nombre de usuario'
            style={styles.input}
            onChangeText={setUsername}
            value={username}
          />
          <TextInput
            placeholder='Edad'
            style={styles.input}
            onChangeText={setAge}
            value={age}
            keyboardType='numeric'
          />
          <TextInput
            placeholder='País'
            style={styles.input}
            onChangeText={setCountry}
            value={country}
          />
        </>
      )}

      <TextInput
        placeholder='Correo electrónico'
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <TextInput
        placeholder='Contraseña'
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isRegistering ? 'Registrarse' : 'Iniciar sesión'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.switchText}>
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB', 
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#F9FAFB', 
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#0F62FE',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    marginTop: 20,
    color: '#0F62FE',
    fontSize: 14,
    fontWeight: '500',
  },
});
