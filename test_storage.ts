import { loadCrystal } from './src/content/storage';
console.log('Successfully imported loadCrystal');
try {
    await loadCrystal('test');
    console.log('Successfully called loadCrystal');
} catch (e) {
    console.error('Failed to call loadCrystal:', e);
}
