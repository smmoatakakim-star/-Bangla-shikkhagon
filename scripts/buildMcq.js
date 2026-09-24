const fs = require('fs');
const path = require('path');

// Helper to write a class file
function writeClassFile(filename, classId, questions) {
  const code = `import { QuizQuestion } from '../../types';

export const ${classId.replace('-', '')}McqList: QuizQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
  fs.writeFileSync(path.join(__dirname, '../src/data/mcq', filename), code, 'utf8');
  console.log(`Wrote ${questions.length} questions to ${filename}`);
}

console.log('Builder ready');
