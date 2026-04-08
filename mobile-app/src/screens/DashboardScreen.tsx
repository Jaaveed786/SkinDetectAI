import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera, History, Shield, Play, User } from 'lucide-react-native';

export default function DashboardScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome Back</Text>
            <Text style={styles.name}>Patient Zero</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <User color="#2dd4bf" size={24} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <History color="#2dd4bf" size={20} />
            <Text style={styles.statVal}>12</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statCard}>
            <Shield color="#fbbf24" size={20} />
            <Text style={styles.statVal}>Low</Text>
            <Text style={styles.statLabel}>Avg Risk</Text>
          </View>
        </View>

        {/* Action Card */}
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Camera')}
        >
          <View style={styles.actionIcon}>
            <Play color="#fff" fill="#fff" size={32} />
          </View>
          <View>
            <Text style={styles.actionTitle}>Start New Scan</Text>
            <Text style={styles.actionDesc}>Capture dermoscopic image</Text>
          </View>
        </TouchableOpacity>

        {/* Recent History */}
        <Text style={styles.sectionTitle}>Recent Encounters</Text>
        {[
          { date: 'Oct 24, 2024', result: 'Benign Nevus', risk: 'Low' },
          { date: 'Sep 12, 2024', result: 'Melanoma Susp.', risk: 'Critical' },
        ].map((item, i) => (
          <View key={i} style={styles.historyItem}>
            <View>
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historyResult}>{item.result}</Text>
            </View>
            <View style={[styles.riskBadge, { backgroundColor: item.risk === 'Low' ? '#065f46' : '#7f1d1d' }]}>
              <Text style={styles.riskText}>{item.risk}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  welcome: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  name: { color: '#fff', fontSize: 28, fontWeight: '900' },
  profileBtn: { width: 45, height: 45, borderRadius: 23, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statCard: { flex: 1, backgroundColor: '#1e293b', padding: 20, borderRadius: 24, borderLeftWidth: 4, borderLeftColor: '#2dd4bf' },
  statVal: { color: '#fff', fontSize: 24, fontWeight: '900', marginVertical: 4 },
  statLabel: { color: '#64748b', fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
  actionCard: { backgroundColor: '#2dd4bf', padding: 25, borderRadius: 32, flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 35 },
  actionIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  actionTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
  actionDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 },
  historyItem: { backgroundColor: '#1e293b', padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  historyDate: { color: '#64748b', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  historyResult: { color: '#fff', fontSize: 14, fontWeight: '900' },
  riskBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  riskText: { color: '#fff', fontSize: 10, fontWeight: '900' }
});
