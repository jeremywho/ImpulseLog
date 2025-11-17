import React, { useState, useRef, useEffect } from 'react';
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

function QuickEntryScreen({ navigation }: any) {
  const { api } = useAuth();
  const [impulseText, setImpulseText] = useState('');
  const [trigger, setTrigger] = useState('');
  const [emotion, setEmotion] = useState('');
  const [didAct, setDidAct] = useState<'yes' | 'no' | 'unknown'>('unknown');
  const [notes, setNotes] = useState('');
  const [showOptional, setShowOptional] = useState(false);
  const [saving, setSaving] = useState(false);

  const impulseInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto-focus the input when screen loads
    setTimeout(() => {
      impulseInputRef.current?.focus();
    }, 100);
  }, []);

  const handleSave = async () => {
    if (!impulseText.trim()) {
      Alert.alert('Error', 'Please enter an impulse');
      return;
    }

    setSaving(true);
    try {
      await api.createImpulse({
        impulseText: impulseText.trim(),
        trigger: trigger.trim() || undefined,
        emotion: emotion.trim() || undefined,
        didAct,
        notes: notes.trim() || undefined,
      });

      // Clear form
      setImpulseText('');
      setTrigger('');
      setEmotion('');
      setDidAct('unknown');
      setNotes('');
      setShowOptional(false);

      Alert.alert('Success', 'Impulse saved successfully', [
        { text: 'OK', onPress: () => navigation.navigate('ImpulseList') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save impulse');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Quick Entry</Text>
        <Text style={styles.subtitle}>
          Capture your impulse in just a few seconds
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            What's the impulse? <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            ref={impulseInputRef}
            style={styles.input}
            value={impulseText}
            onChangeText={setImpulseText}
            placeholder="E.g., Want to buy new headphones"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.optionalToggle}
          onPress={() => setShowOptional(!showOptional)}>
          <Text style={styles.optionalToggleText}>
            {showOptional ? '▼' : '▶'} Add details (optional)
          </Text>
        </TouchableOpacity>

        {showOptional && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>What triggered it?</Text>
              <TextInput
                style={styles.input}
                value={trigger}
                onChangeText={setTrigger}
                placeholder="E.g., Saw an ad on YouTube"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>How do you feel?</Text>
              <TextInput
                style={styles.input}
                value={emotion}
                onChangeText={setEmotion}
                placeholder="E.g., Excited, anxious, bored"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Did you act on it?</Text>
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
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Additional notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any other thoughts..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Impulse</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: '#666',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  required: {
    color: '#dc3545',
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
  optionalToggle: {
    paddingVertical: 10,
    marginBottom: 15,
  },
  optionalToggleText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '500',
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
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
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

export default QuickEntryScreen;
