import Papa from 'papaparse';

export interface StudentRecord {
  name: string;
  email: string;
  roll_number: string;
}

export const parseCSV = (file: File): Promise<StudentRecord[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim().toLowerCase(),
      complete: (results: any) => {
        const students: StudentRecord[] = results.data
          .filter((row: any) => row.name && row.email)
          .map((row: any) => ({
            name: row.name?.trim() || '',
            email: row.email?.trim().toLowerCase() || '',
            roll_number: row.roll_number?.trim() || row.rollno?.trim() || '',
          }));

        if (students.length === 0) {
          reject(new Error('No valid student records found in CSV'));
          return;
        }

        resolve(students);
      },
      error: (error: any) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
};

export const validateStudents = (students: StudentRecord[]): { valid: StudentRecord[]; errors: string[] } => {
  const errors: string[] = [];
  const valid: StudentRecord[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const seenEmails = new Set<string>();

  students.forEach((student, index) => {
    const rowErrors: string[] = [];

    if (!student.name || student.name.length < 2) {
      rowErrors.push(`Row ${index + 1}: Invalid name`);
    }

    if (!student.email || !emailRegex.test(student.email)) {
      rowErrors.push(`Row ${index + 1}: Invalid email format`);
    }

    if (seenEmails.has(student.email)) {
      rowErrors.push(`Row ${index + 1}: Duplicate email`);
    }

    if (rowErrors.length === 0) {
      valid.push(student);
      seenEmails.add(student.email);
    } else {
      errors.push(...rowErrors);
    }
  });

  return { valid, errors };
};
