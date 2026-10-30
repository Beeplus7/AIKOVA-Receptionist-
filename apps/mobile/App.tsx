import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>AIKOVA</Text>
      <Text style={styles.title}>Receptionist</Text>
      <Text style={styles.tagline}>
        Mobile client for the AIKOVA Receptionist — ready to build.
      </Text>
      <Text style={styles.hint}>Edit apps/mobile/App.tsx to get started.</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#0d9488',
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
    color: '#0f172a',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 17,
    lineHeight: 26,
    color: '#4a5568',
    marginBottom: 20,
  },
  hint: {
    fontSize: 14,
    color: '#64748b',
  },
});
