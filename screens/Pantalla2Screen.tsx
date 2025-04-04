import { StyleSheet, Text, View, FlatList, Modal, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function Pantalla2Screen() {
  const [videojuegos, setVideojuegos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);

  useEffect(() => {
    fetch('https://jritsqmet.github.io/web-api/videojuegos.json')
      .then((response) => response.json())
      .then((data) => setVideojuegos(data.videojuegos))
      .catch((error) => console.error('Error al cargar los datos:', error));
  }, []);

  const handleCardPress = (game: any) => {
    setSelectedGame(game);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Videojuegos</Text>
      <FlatList
        data={videojuegos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
            <Image source={{ uri: item.imagen }} style={styles.image} />
            <Text style={styles.name}>{item.titulo}</Text>
            <Text style={styles.detail}>Género: {item.genero.join(', ')}</Text>
            <Text style={styles.detail}>Plataforma: {item.plataforma.join(', ')}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedGame?.titulo}</Text>
            <Text style={styles.modalDetail}>Género: {selectedGame?.genero.join(', ')}</Text>
            <Text style={styles.modalDetail}>Plataforma: {selectedGame?.plataforma.join(', ')}</Text>
            <Text style={styles.modalDetail}>Desarrollador: {selectedGame?.desarrollador}</Text>
            <Text style={styles.modalDetail}>Lanzamiento: {selectedGame?.lanzamiento}</Text>
            <Text style={styles.modalDetail}>Precio: ${selectedGame?.precio}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff', 
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  detail: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '90%',
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  modalDetail: {
    fontSize: 15,
    color: '#374151',
    marginTop: 6,
  },
  closeButton: {
    marginTop: 20,
    color: '#0F62FE', 
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
