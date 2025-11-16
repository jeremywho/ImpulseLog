import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Account')}>
          <Text style={styles.headerButtonText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome, {user?.username}!</Text>
        <Text style={styles.text}>
          This is your home page. You're successfully logged in.
        </Text>

        {user?.fullName && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{user.fullName}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Member since:</Text>
          <Text style={styles.value}>
            {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  headerButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  infoRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
