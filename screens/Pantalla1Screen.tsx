import {
  Button, StyleSheet, Text, View, TextInput, Alert,
  FlatList, Image, TouchableOpacity, ScrollView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { ref, push, get, child } from 'firebase/database';
import { db } from '../config/Config';
import { getAuth } from 'firebase/auth';

export default function ScoreScreen() {
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [puntaje, setPuntaje] = useState('');
  const [totalPuntaje, setTotalPuntaje] = useState(0);
  const [totalGlobal, setTotalGlobal] = useState(0);
  const [videojuegos, setVideojuegos] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState<any[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setId(user.uid);
      cargarTotalPuntaje(user.uid);
      cargarTotalGlobal();
      cargarVideojuegos();
    } else {
      Alert.alert('Error', 'No hay un usuario autenticado.');
    }
  }, []);

  function cargarVideojuegos() {
    fetch('https://jritsqmet.github.io/web-api/videojuegos.json')
      .then((response) => response.json())
      .then((data) => setVideojuegos(data.videojuegos))
      .catch((error) => console.error('Error al cargar los videojuegos:', error));
  }

  function cargarTotalPuntaje(uid: string) {
    const usuarioRef = ref(db, 'usuarios/' + uid + '/puntajes');
    get(usuarioRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const puntajes = snapshot.val();
          let total = 0;
          for (const key in puntajes) {
            total += puntajes[key].puntaje;
          }
          setTotalPuntaje(total);
        } else {
          setTotalPuntaje(0);
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'No se pudo obtener el puntaje total: ' + error.message);
      });
  }

  function cargarTotalGlobal() {
    const usuariosRef = ref(db, 'usuarios');
    get(usuariosRef)
      .then((snapshot) => {
        let total = 0;
        snapshot.forEach((userSnap) => {
          const puntajes = userSnap.child('puntajes').val();
          if (puntajes) {
            for (const key in puntajes) {
              total += puntajes[key].puntaje;
            }
          }
        });
        setTotalGlobal(total);
      })
      .catch((error) => {
        console.log('Error al cargar el total global:', error.message);
      });
  }

  function guardarPuntaje() {
    if (!nombre || !selectedGame || !puntaje || !edad) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (isNaN(parseInt(edad)) || parseInt(edad) <= 0) {
      Alert.alert('Error', 'La edad debe ser un número válido.');
      return;
    }

    if (isNaN(parseInt(puntaje)) || parseInt(puntaje) < 0) {
      Alert.alert('Error', 'El puntaje debe ser un número válido.');
      return;
    }

    const usuarioRef = ref(db, 'usuarios/' + id + '/puntajes');
    push(usuarioRef, {
      nombre,
      videojuego: selectedGame.titulo,
      edad: parseInt(edad),
      puntaje: parseInt(puntaje),
      fecha: Date.now(),
    })
      .then(() => {
        Alert.alert('Éxito', 'Puntaje guardado correctamente.');
        setNombre('');
        setEdad('');
        setPuntaje('');
        setBusqueda('');
        setSelectedGame(null);
        setSugerencias([]);
        cargarTotalPuntaje(id);
        cargarTotalGlobal();
      })
      .catch((error) => {
        Alert.alert('Error', 'No se pudo guardar el puntaje: ' + error.message);
      });
  }

  function manejarBusqueda(text: string) {
    setBusqueda(text);
    if (text.length > 0) {
      const filtrados = videojuegos.filter(game =>
        game.titulo.toLowerCase().includes(text.toLowerCase())
      );
      setSugerencias(filtrados);
    } else {
      setSugerencias([]);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Puntaje</Text>

      <TextInput
        placeholder="ID del usuario"
        style={styles.input2}
        value={id}
        editable={false}
      />

      <TextInput
        placeholder="Nombre"
        style={styles.input}
        onChangeText={setNombre}
        value={nombre}
      />

      <TextInput
        placeholder="Edad"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setEdad}
        value={edad}
      />

      <TextInput
        placeholder="Buscar videojuego"
        style={styles.input}
        onChangeText={manejarBusqueda}
        value={busqueda}
      />
      {sugerencias.length > 0 && (
        <FlatList
          data={sugerencias}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestion}
              onPress={() => {
                setSelectedGame(item);
                setBusqueda(item.titulo);
                setSugerencias([]);
              }}
            >
              <Text>{item.titulo}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedGame && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedGame.imagen }} style={styles.image} />
          <Text style={styles.detailText}>Precio: ${selectedGame.precio}</Text>
          <Text style={styles.detailText}>Plataformas: {selectedGame.plataforma.join(', ')}</Text>
        </View>
      )}

      <TextInput
        placeholder="Puntaje"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setPuntaje}
        value={puntaje}
      />

      <Button title="Guardar Puntaje" onPress={guardarPuntaje} />

      <Text style={styles.totalText}>Total Puntaje Usuario: {totalPuntaje}</Text>
      <Text style={styles.totalText}>Total Puntaje Global: {totalGlobal}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
    fontSize: 16,
    color: '#111827',
  },
  input2: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  suggestion: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    width: '100%',
  },
  imageContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 12,
  },
  detailText: {
    fontSize: 14,
    marginTop: 6,
    color: '#374151',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 24,
    textAlign: 'center',
  },
});
