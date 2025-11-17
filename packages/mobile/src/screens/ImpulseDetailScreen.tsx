import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import type { ImpulseEntry } from '@impulse-log/shared';

function ImpulseDetailScreen({ route, navigation }: any) {
  const { api } = useAuth();
  const { id } = route.params;

  const [impulse, setImpulse] = useState<ImpulseEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [impulseText, setImpulseText] = useState('');
  const [trigger, setTrigger] = useState('');
  const [emotion, setEmotion] = useState('');
  const [didAct, setDidAct] = useState<'yes' | 'no' | 'unknown'>('unknown');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadImpulse();
  }, []);

  const loadImpulse = async () => {
    try {
      const data = await api.getImpulse(id);
      setImpulse(data);
      setImpulseText(data.impulseText);
      setTrigger(data.trigger || '');
      setEmotion(data.emotion || '');
      setDidAct(data.didAct);
      setNotes(data.notes || '');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load impulse');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!impulseText.trim()) {
      Alert.alert('Error', 'Impulse text cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const updated = await api.updateImpulse(id, {
        impulseText: impulseText.trim(),
        trigger: trigger.trim() || undefined,
        emotion: emotion.trim() || undefined,
        didAct,
        notes: notes.trim() || undefined,
      });
      setImpulse(updated);
      setEditing(false);
      Alert.alert('Success', 'Impulse updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update impulse');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Impulse',
      'Are you sure you want to delete this impulse? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteImpulse(id);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete impulse');
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    if (impulse) {
      setImpulseText(impulse.impulseText);
      setTrigger(impulse.trigger || '');
      setEmotion(impulse.emotion || '');
      setDidAct(impulse.didAct);
      setNotes(impulse.notes || '');
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!impulse) {
    return null;
  }

  const date = new Date(impulse.createdAt);
  const dateStr = date.toLocaleDateString();
  const timeStr = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>
              {dateStr} at {timeStr}
            </Text>
            {impulse.updatedAt && impulse.updatedAt !== impulse.createdAt && (
              <Text style={styles.updatedText}>
                Updated:{' '}
                {new Date(impulse.updatedAt).toLocaleDateString() +
                  ' ' +
                  new Date(impulse.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </Text>
            )}
          </View>
          {!editing && (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditing(true)}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Impulse</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={impulseText}
              onChangeText={setImpulseText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          ) : (
            <Text style={styles.valueText}>{impulse.impulseText}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Trigger</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={trigger}
              onChangeText={setTrigger}
              placeholder="None"
            />
          ) : (
            <Text style={styles.valueText}>{impulse.trigger || 'None'}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Emotion</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={emotion}
              onChangeText={setEmotion}
              placeholder="None"
            />
          ) : (
            <Text style={styles.valueText}>{impulse.emotion || 'None'}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Did you act on it?</Text>
          {editing ? (
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  didAct === 'yes' && styles.radioButtonActive,
                ]}
                onPress={() => setDidAct('yes')}>
                <Text
                  style={[
                    styles.radioButtonText,
                    didAct === 'yes' && styles.radioButtonTextActive,
                  ]}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  didAct === 'no' && styles.radioButtonActive,
                ]}
                onPress={() => setDidAct('no')}>
                <Text
                  style={[
                    styles.radioButtonText,
                    didAct === 'no' && styles.radioButtonTextActive,
                  ]}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  didAct === 'unknown' && styles.radioButtonActive,
                ]}
                onPress={() => setDidAct('unknown')}>
                <Text
                  style={[
                    styles.radioButtonText,
                    didAct === 'unknown' && styles.radioButtonTextActive,
                  ]}>
                  Not sure
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                styles.badge,
                impulse.didAct === 'yes' && styles.badgeYes,
                impulse.didAct === 'no' && styles.badgeNo,
                impulse.didAct === 'unknown' && styles.badgeUnknown,
              ]}>
              <Text style={styles.badgeText}>
                {impulse.didAct === 'yes'
                  ? 'Yes, I acted on it'
                  : impulse.didAct === 'no'
                    ? 'No, I resisted'
                    : 'Not sure'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          {editing ? (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="None"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          ) : (
            <Text style={styles.valueText}>{impulse.notes || 'None'}</Text>
          )}
        </View>

        {editing && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  updatedText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  editButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#dc3545',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
  },
  radioButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  radioButtonText: {
    fontSize: 14,
    color: '#333',
  },
  radioButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  saveButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImpulseDetailScreen;
