const { execSync } = require('child_process');
const fs = require('fs');

try {
    const output = execSync('npm run build', { encoding: 'utf-8' });
    fs.writeFileSync('build.log', output);
} catch (error) {
    fs.writeFileSync('build.log', error.stdout + '\n' + error.stderr);
}
