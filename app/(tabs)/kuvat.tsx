import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function KuvatScreen() {
	return (
		<ThemedView style={styles.container}>
			<Text style={styles.title}>Kuvat (Images)</Text>
			<Text>Tämä on paikka, jossa kuvat näytetään. Lisää tähän kuvanäkymä tai galleria.</Text>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
		marginBottom: 8,
	},
});
