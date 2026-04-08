import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, Download, ShieldCheck, AlertTriangle, Info } from 'lucide-react-native';

export default function ResultsScreen({ route, navigation }: any) {
  const { imageUri } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Dashboard')}>
          <ArrowLeft color="#fff" size={24} />
          <Text style={styles.backText}>Dashboard</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Analysis Result</Text>

        {/* Scan Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={styles.scanOverlay}>
            <Text style={styles.overlayText}>AI Scanned Image</Text>
          </View>
        </View>

        {/* Result Card */}
        <View style={styles.resultCard}>
          <View style={styles.riskHeader}>
            <View style={styles.riskBadge}>
              <Text style={styles.riskLevel}>LOW RISK</Text>
            </View>
            <View style={styles.confidenceCircle}>
              <Text style={styles.confidenceVal}>92%</Text>
            </View>
          </View>

          <Text style={styles.diseaseName}>Benign Melanocytic Nevus</Text>
          <Text style={styles.diseaseDesc}>
            Our AI engine has identified this lesion as a benign melanocytic nevus. No urgent clinical action is required at this stage.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.recsTitle}>Recommendations</Text>
          <View style={styles.recItem}>
            <ShieldCheck color="#2dd4bf" size={18} />
            <Text style={styles.recText}>Perform monthly self-prescreening.</Text>
          </View>
          <View style={styles.recItem}>
            <ShieldCheck color="#2dd4bf" size={18} />
            <Text style={styles.recText}>Follow ABCDE skin cancer guidelines.</Text>
          </View>
        </View>

        {/* Call to Action */}
        <TouchableOpacity style={styles.downloadBtn}>
          <Download color="#020617" size={20} />
          <Text style={styles.downloadText}>Download PDF Report</Text>
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <Info color="#64748b" size={16} />
          <Text style={styles.disclaimerText}>
            This is an AI-generated screening and not a clinical diagnosis. Consult a dermatologist for confirmed results.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 25 },
  backText: { color: '#94a3b8', fontSize: 16, fontWeight: '700' },
  title: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 20 },
  imageContainer: { width: '100%', height: 250, borderRadius: 24, overflow: 'hidden', marginBottom: 25, position: 'relative', borderWidth: 1, borderColor: '#1e293b' },
  image: { width: '100%', height: '100%' },
  scanOverlay: { position: 'absolute', bottom: 15, right: 15, backgroundColor: 'rgba(2, 6, 23, 0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  overlayText: { color: '#2dd4bf', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  resultCard: { backgroundColor: '#1e293b', padding: 25, borderRadius: 32, borderTopWidth: 4, borderTopColor: '#2dd4bf' },
  riskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  riskBadge: { backgroundColor: 'rgba(45, 212, 191, 0.1)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#2dd4bf' },
  riskLevel: { color: '#2dd4bf', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  confidenceCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2dd4bf', justifyContent: 'center', alignItems: 'center' },
  confidenceVal: { color: '#020617', fontSize: 16, fontWeight: '900' },
  diseaseName: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 12 },
  diseaseDesc: { color: '#94a3b8', fontSize: 14, lineHeight: 22, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 20 },
  recsTitle: { color: '#fff', fontSize: 16, fontWeight: '900', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  recItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  recText: { color: '#cbd5e1', fontSize: 14, fontWeight: '600' },
  downloadBtn: { backgroundColor: '#2dd4bf', height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 30 },
  downloadText: { color: '#020617', fontSize: 16, fontWeight: '900' },
  disclaimer: { flexDirection: 'row', gap: 10, marginTop: 25, paddingHorizontal: 10 },
  disclaimerText: { flex: 1, color: '#64748b', fontSize: 12, lineHeight: 18, fontWeight: '500' }
});
