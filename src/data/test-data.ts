// Quick test to verify enhanced data is imported correctly
import { enhancedStudents, enhancedProfessors } from './enhancedMockData';

console.log('Enhanced Professors:', enhancedProfessors.length);
console.log('First Professor:', enhancedProfessors[0]);

console.log('\nEnhanced Students:', enhancedStudents.length);
console.log('First 3 Students:', enhancedStudents.slice(0, 3).map(s => ({
    name: s.full_name,
    email: s.email,
    roll: s.roll_number
})));
