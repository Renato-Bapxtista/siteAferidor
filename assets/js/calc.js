// calculator.js - Simulador do Aferidor Inteligente

class AferidorSimulator {
    constructor() {
        this.currentMode = 'standard';
        this.currentPressure = null;
        this.history = [];
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        // Botões de modo
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setMode(e.target.dataset.mode);
            });
        });

        // Botões de controle
        document.querySelectorAll('.sim-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleButtonPress(e.target.dataset.action);
            });
        });

        // Limpar histórico
        document.getElementById('clearHistory').addEventListener('click', () => {
            this.clearHistory();
        });

        // Atualizar configurações em tempo real
        document.querySelectorAll('#vehicleType, #tireType, #load, #temperature').forEach(input => {
            input.addEventListener('change', () => {
                if (this.currentMode === 'analytical') {
                    this.calculateRecommendation();
                }
            });
        });
    }

    setMode(mode) {
        this.currentMode = mode;
        
        // Atualizar botões de modo
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Mostrar/ocultar configurações
        const configSection = document.getElementById('vehicleConfig');
        configSection.style.display = mode === 'analytical' ? 'block' : 'none';

        this.updateDisplay();
    }

    handleButtonPress(action) {
        switch(action) {
            case 'up':
                this.handleUpButton();
                break;
            case 'down':
                this.handleDownButton();
                break;
            case 'confirm':
                this.handleConfirmButton();
                break;
            case 'double':
                this.handleDoubleClick();
                break;
        }
    }

    handleUpButton() {
        if (this.currentMode === 'analytical') {
            this.navigateMenu('up');
        } else {
            this.simulateMeasurement();
        }
    }

    handleDownButton() {
        if (this.currentMode === 'analytical') {
            this.navigateMenu('down');
        } else {
            // No modo padrão, down pode ser usado para outras funções
            this.showStatistics();
        }
    }

    handleConfirmButton() {
        if (this.currentMode === 'analytical') {
            this.selectMenuOption();
        } else {
            this.simulateMeasurement();
        }
    }

    handleDoubleClick() {
        // Alternar entre modos
        this.setMode(this.currentMode === 'standard' ? 'analytical' : 'standard');
    }

    simulateMeasurement() {
        // Simular leitura de sensores
        const pressure = this.generateRandomPressure();
        const atmospheric = this.generateRandomAtmospheric();
        const temperature = this.generateRandomTemperature();

        this.currentPressure = pressure;

        // Atualizar display
        this.updateMeasurementDisplay(pressure, atmospheric, temperature);

        // Calcular recomendação se no modo analítico
        if (this.currentMode === 'analytical') {
            this.calculateRecommendation();
        }

        // Adicionar ao histórico
        this.addToHistory(pressure, atmospheric, temperature);
    }

    generateRandomPressure() {
        // Simular pressão entre 20-40 PSI (faixa comum para pneus)
        return (Math.random() * 20 + 20).toFixed(1);
    }

    generateRandomAtmospheric() {
        // Pressão atmosférica em hPa (980-1030 é a faixa normal)
        return (Math.random() * 50 + 980).toFixed(1);
    }

    generateRandomTemperature() {
        // Temperatura entre 15-35°C
        return (Math.random() * 20 + 15).toFixed(1);
    }

    updateMeasurementDisplay(pressure, atmospheric, temperature) {
        document.getElementById('line1').textContent = `Pressão: ${pressure} PSI`;
        document.getElementById('line2').textContent = `Atmosf: ${atmospheric} hPa`;
        document.getElementById('line3').textContent = `Temp: ${temperature}°C`;
        document.getElementById('line4').textContent = this.getPressureStatus(pressure);

        // Atualizar resultados
        document.getElementById('resultPressure').textContent = `${pressure} PSI`;
        document.getElementById('resultAtmospheric').textContent = `${atmospheric} hPa`;
        document.getElementById('resultTemperature').textContent = `${temperature}°C`;
    }

    getPressureStatus(pressure) {
        const press = parseFloat(pressure);
        if (press < 25) return 'BAIXA - CALIBRAR';
        if (press > 35) return 'ALTA - ALIVIAR';
        return 'NORMAL ✓';
    }

    calculateRecommendation() {
        if (!this.currentPressure) return;

        const vehicleType = document.getElementById('vehicleType').value;
        const load = parseInt(document.getElementById('load').value);
        const temperature = parseInt(document.getElementById('temperature').value);

        let idealPressure = 30; // PSI padrão

        // Ajustar baseado no tipo de veículo
        switch(vehicleType) {
            case 'car': idealPressure = 32; break;
            case 'suv': idealPressure = 35; break;
            case 'motorcycle': idealPressure = 28; break;
            case 'bike': idealPressure = 45; break;
        }

        // Ajustar baseado na carga
        if (load > 400) idealPressure += 2;
        if (load > 600) idealPressure += 2;

        // Ajustar baseado na temperatura (regra geral: 1 PSI para cada 10°C)
        const tempAdjustment = (temperature - 25) / 10;
        idealPressure += tempAdjustment;

        const current = parseFloat(this.currentPressure);
        let recommendation = '';

        if (current < idealPressure - 3) {
            recommendation = `Calibrar para ${idealPressure.toFixed(1)} PSI`;
        } else if (current > idealPressure + 3) {
            recommendation = `Aliviar para ${idealPressure.toFixed(1)} PSI`;
        } else {
            recommendation = `Pressão OK (${idealPressure.toFixed(1)} PSI ideal)`;
        }

        document.getElementById('resultRecommendation').textContent = recommendation;
    }

    navigateMenu(direction) {
        // Simular navegação no menu
        const display = document.querySelector('.display-content');
        display.style.animation = 'blink 0.3s';
        setTimeout(() => display.style.animation = '', 300);
    }

    selectMenuOption() {
        // Simular seleção de opção no menu
        this.simulateMeasurement();
    }

    showStatistics() {
        // Mostrar estatísticas no display
        document.getElementById('line1').textContent = 'Estatísticas:';
        document.getElementById('line2').textContent = `Leituras: ${this.history.length}`;
        document.getElementById('line3').textContent = 'Modo: Estatísticas';
        document.getElementById('line4').textContent = 'OK para voltar';
    }

    addToHistory(pressure, atmospheric, temperature) {
        const timestamp = new Date().toLocaleTimeString();
        const reading = {
            timestamp,
            pressure,
            atmospheric,
            temperature,
            status: this.getPressureStatus(pressure)
        };

        this.history.unshift(reading);
        if (this.history.length > 5) {
            this.history.pop();
        }

        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = this.history.map(reading => `
            <div class="history-item">
                <strong>${reading.timestamp}</strong> - 
                ${reading.pressure} PSI - 
                ${reading.status}
            </div>
        `).join('');
    }

    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
    }

    updateDisplay() {
        const modeText = this.currentMode === 'standard' ? 'Padrão' : 'Analítico';
        document.getElementById('line2').textContent = `Modo: ${modeText}`;
        
        if (!this.currentPressure) {
            document.getElementById('line1').textContent = 'Aferidor Inteligente';
            document.getElementById('line3').textContent = 'Pressione OK para medir';
            document.getElementById('line4').textContent = '---';
        }
    }
}

// CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    .display-content {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new AferidorSimulator();
});