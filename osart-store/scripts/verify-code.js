const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
    console.log(`Ejecutando: ${command}...`);
    try {
        const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
        return { success: true, output };
    } catch (error) {
        return { success: false, output: error.stdout, error: error.message };
    }
}

async function verify() {
    console.log('--- INICIO DE VERIFICACIÓN AUTÓNOMA OSART ---\n');

    // 1. Verificación de Tipos (TypeScript)
    const tscCheck = runCommand('npx tsc --noEmit');
    if (!tscCheck.success) {
        console.error('❌ ERRORES DE TIPO DETECTADOS:');
        console.error(tscCheck.output);
    } else {
        console.log('✅ Tipos de TypeScript: OK');
    }

    // 2. Verificación de Linting
    const lintCheck = runCommand('npx next lint');
    if (!lintCheck.success) {
        console.error('⚠️ ADVERTENCIAS/ERRORES DE LINT DETECTADOS:');
        console.error(lintCheck.output);
    } else {
        console.log('✅ Linting (ESLint): OK');
    }

    // 3. Verificación de Archivos Críticos
    const criticalFiles = [
        'src/app/academy/page.tsx',
        'src/components/game/ElectronicsGame.tsx',
        'src/store/cartStore.ts'
    ];

    criticalFiles.forEach(file => {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
            console.log(`✅ Archivo crítico detectado: ${file}`);
        } else {
            console.error(`❌ Archivo crítico faltante: ${file}`);
        }
    });

    console.log('\n--- VERIFICACIÓN FINALIZADA ---');
}

verify();
