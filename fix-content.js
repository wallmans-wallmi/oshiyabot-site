// Temporary fix script for line 313
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the content string
content = content.replace(
  /content: 'היי, חזרת אליי 😊\\nטוב לראות אותך שוב\.\\nטוב לראות אותך שוב\.',/g,
  "content: 'היי, חזרת אלי\\nטוב לראות אותך שוב.',"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed line 313!');
