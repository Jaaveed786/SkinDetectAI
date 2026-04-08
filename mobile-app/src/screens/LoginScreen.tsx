import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function LoginScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Shield size={48} color="#2dd4bf" />
          </View>
          <Text style={styles.title}>SkinDetect AI</Text>
          <p style={styles.tagline}>Intelligent Dermatological Analysis</p>
        </View>

        <View style={styles.form}>
          <div style={styles.inputGroup}>
            <Mail color="#2dd4bf" size={20} style={styles.icon} />
            <TextInput 
              placeholder="Email Address"
              placeholderTextColor="#64748b"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock color="#2dd4bf" size={20} style={styles.icon} />
            <TextInput 
              placeholder="Password"
              placeholderTextColor="#64748b"
              secureTextEntry
              style={styles.input}
            />
          </div>

          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.loginText}>Sign In</Text>
            <ArrowRight color="#fff" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Credentials?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.noAcc}>New to SkinDetect?</Text>
          <TouchableOpacity>
            <Text style={styles.createAcc}> Create Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { flex: 1, padding: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 50 },
  logoContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(45, 212, 191, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: 1 },
  tagline: { color: '#64748b', fontSize: 14, fontWeight: '600', marginTop: 8 },
  form: { gap: 15 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 16, paddingHorizontal: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 55, color: '#fff', fontSize: 16, fontWeight: '600' },
  loginBtn: { backgroundColor: '#2dd4bf', height: 60, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
  loginText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  forgotBtn: { alignSelf: 'center', marginTop: 15 },
  forgotText: { color: '#64748b', fontSize: 14, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  noAcc: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  createAcc: { color: '#2dd4bf', fontSize: 14, fontWeight: '900' }
});
