import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import type { ImpulseEntry } from '@impulse-log/shared';

function ImpulseListScreen({ navigation }: any) {
  const { api } = useAuth();
  const [impulses, setImpulses] = useState<ImpulseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'yes' | 'no' | 'unknown'>('all');

  const loadImpulses = useCallback(async () => {
    try {
      const data = await api.getImpulses({
        didAct: filter === 'all' ? undefined : filter,
      });
      setImpulses(data);
    } catch (error: any) {
      console.error('Failed to load impulses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [api, filter]);

  useEffect(() => {
    loadImpulses();
  }, [loadImpulses]);

  useEffect(() => {
    // Reload when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadImpulses();
    });
    return unsubscribe;
  }, [navigation, loadImpulses]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadImpulses();
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setLoading(true);
  };

  const renderImpulse = ({ item }: { item: ImpulseEntry }) => {
    const date = new Date(item.createdAt);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <TouchableOpacity
        style={styles.impulseCard}
        onPress={() => navigation.navigate('ImpulseDetail', { id: item.id })}>
        <View style={styles.impulseHeader}>
          <Text style={styles.impulseDate}>
            {dateStr} at {timeStr}
          </Text>
          <View
            style={[
              styles.badge,
              item.didAct === 'yes' && styles.badgeYes,
              item.didAct === 'no' && styles.badgeNo,
              item.didAct === 'unknown' && styles.badgeUnknown,
            ]}>
            <Text style={styles.badgeText}>
              {item.didAct === 'yes'
                ? 'Acted'
                : item.didAct === 'no'
                  ? 'Resisted'
                  : 'Unknown'}
            </Text>
          </View>
        </View>
        <Text style={styles.impulseText} numberOfLines={2}>
          {item.impulseText}
        </Text>
        {(item.trigger || item.emotion) && (
          <View style={styles.metaRow}>
            {item.trigger && (
              <Text style={styles.metaText} numberOfLines={1}>
                🎯 {item.trigger}
              </Text>
            )}
            {item.emotion && (
              <Text style={styles.metaText} numberOfLines={1}>
                💭 {item.emotion}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No impulses yet</Text>
      <Text style={styles.emptySubtext}>
        Tap the + button below to add your first impulse
      </Text>
    </View>
  );

  if (loading && impulses.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('all')}>
          <Text
            style={[
              styles.filterButtonText,
              filter === 'all' && styles.filterButtonTextActive,
            ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'yes' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('yes')}>
          <Text
            style={[
              styles.filterButtonText,
              filter === 'yes' && styles.filterButtonTextActive,
            ]}>
            Acted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'no' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('no')}>
          <Text
            style={[
              styles.filterButtonText,
              filter === 'no' && styles.filterButtonTextActive,
            ]}>
            Resisted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'unknown' && styles.filterButtonActive,
          ]}
          onPress={() => handleFilterChange('unknown')}>
          <Text
            style={[
              styles.filterButtonText,
              filter === 'unknown' && styles.filterButtonTextActive,
            ]}>
            Unknown
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={impulses}
        renderItem={renderImpulse}
        keyExtractor={item => item.id}
        contentContainerStyle={
          impulses.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('QuickEntry')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  filterRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  emptyListContainer: {
    flex: 1,
  },
  impulseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  impulseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  impulseDate: {
    fontSize: 12,
    color: '#666',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeYes: {
    backgroundColor: '#dc3545',
  },
  badgeNo: {
    backgroundColor: '#28a745',
  },
  badgeUnknown: {
    backgroundColor: '#6c757d',
  },
  badgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  impulseText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 15,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ImpulseListScreen;
