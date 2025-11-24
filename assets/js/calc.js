// aferidor-simulator.js - Versão Corrigida

class AferidorRealista {
    constructor() {
        this.modo = 'padrao';
        this.menuSelecionado = 0;
        this.medicaoAtual = null;
        this.historico = [];
        this.config = {
            veiculo: 'Carro Passeio',
            pneu: 'Radial',
            carga: 'Média (200-400kg)',
            unidade: 'psi'
        };
        
        // Variáveis para controle do duplo clique
        this.ultimoClique = 0;
        this.aguardandoSegundoClique = false;
        this.timeoutDuploClique = null;
        
        this.menus = {
            principal: [
                '📏 Fazer Medição',
                '🚗 Tipo de Veículo',
                '🎯 Tipo de Pneu', 
                '⚖️ Configurar Carga',
                '📊 Ver Histórico',
                '⚙️ Configurações'
            ],
            veiculos: ['Carro Passeio', 'SUV/4x4', 'Motocicleta', 'Bicicleta'],
            pneus: ['Radial', 'Diagonal', 'Tubeless', 'Com Câmara'],
            cargas: ['Leve (até 200kg)', 'Média (200-400kg)', 'Pesada (400-600kg)', 'Máxima (600kg+)']
        };
        
        this.inicializar();
    }

    inicializar() {
        this.configurarEventos();
        this.atualizarDisplayInicial();
        this.atualizarStatus();
    }

    configurarEventos() {
        const btnConfirm = document.querySelector('.btn-confirm');
        
        // Clique simples
        btnConfirm.addEventListener('click', (e) => {
            const agora = Date.now();
            const diferenca = agora - this.ultimoClique;
            
            // Se foi um clique rápido (menos de 300ms desde o último clique)
            if (diferenca < 300 && this.ultimoClique !== 0) {
                // É um duplo clique - cancelar o clique simples
                e.preventDefault();
                e.stopPropagation();
                clearTimeout(this.timeoutDuploClique);
                this.aguardandoSegundoClique = false;
                this.processarDuploClique();
            } else {
                // Primeiro clique - aguardar possível segundo clique
                this.aguardandoSegundoClique = true;
                this.timeoutDuploClique = setTimeout(() => {
                    // Tempo esgotado - é um clique simples
                    if (this.aguardandoSegundoClique) {
                        this.processarCliqueSimples();
                        this.aguardandoSegundoClique = false;
                    }
                }, 300);
            }
            
            this.ultimoClique = agora;
        });

        // Botões de navegação
        document.querySelector('.btn-up').addEventListener('click', () => this.botaoUp());
        document.querySelector('.btn-down').addEventListener('click', () => this.botaoDown());
        
        // Prevenir duplo clique nos botões de navegação
        document.querySelectorAll('.btn-nav').forEach(btn => {
            btn.addEventListener('dblclick', (e) => e.preventDefault());
        });

        // Atualizar relógio
        setInterval(() => this.atualizarStatus(), 60000);
    }

    processarCliqueSimples() {
        console.log('Clique simples detectado');
        switch(this.modo) {
            case 'padrao':
                this.iniciarMedicao();
                break;
            case 'menu':
                this.selecionarMenu();
                break;
            case 'config':
                this.confirmarConfig();
                break;
            case 'medicao':
                this.finalizarMedicao();
                break;
        }
    }

    processarDuploClique() {
        console.log('Duplo clique detectado!');
        this.alternarModo();
    }

    botaoUp() {
        switch(this.modo) {
            case 'menu':
                this.navegarMenu(-1);
                break;
            case 'config':
                this.alterarConfig(-1);
                break;
            case 'padrao':
                this.mostrarPressaoRecomendada();
                break;
        }
    }

    botaoDown() {
        switch(this.modo) {
            case 'menu':
                this.navegarMenu(1);
                break;
            case 'config':
                this.alterarConfig(1);
                break;
            case 'padrao':
                this.mostrarHistoricoRapido();
                break;
        }
    }

    alternarModo() {
        if (this.modo === 'padrao') {
            this.entrarMenu();
        } else {
            this.voltarPadrao();
        }
    }

    entrarMenu() {
        this.modo = 'menu';
        this.menuSelecionado = 0;
        this.atualizarDisplayMenu();
        this.mostrarFeedback('Modo Menu');
    }

    voltarPadrao() {
        this.modo = 'padrao';
        this.atualizarDisplayPadrao();
        this.mostrarFeedback('Modo Padrão');
    }

    navegarMenu(direcao) {
        const menuAtual = this.menus.principal;
        this.menuSelecionado = (this.menuSelecionado + direcao + menuAtual.length) % menuAtual.length;
        this.atualizarDisplayMenu();
        
        // Feedback de navegação
        this.piscarDisplay();
    }

    atualizarDisplayMenu() {
        const menuItems = this.menus.principal;
        const linhas = [
            "MENU PRINCIPAL",
            `${this.menuSelecionado + 1}/${menuItems.length}`,
            `> ${menuItems[this.menuSelecionado]}`,
            "[OK] Selecionar"
        ];
        
        this.atualizarDisplay(linhas);
    }

    selecionarMenu() {
        const opcoes = {
            0: () => this.iniciarMedicao(),
            1: () => this.configurarVeiculo(),
            2: () => this.configurarPneu(),
            3: () => this.configurarCarga(),
            4: () => this.verHistorico(),
            5: () => this.configuracoes()
        };
        
        if (opcoes[this.menuSelecionado]) {
            this.mostrarFeedback(`Abrindo: ${this.menus.principal[this.menuSelecionado]}`);
            opcoes[this.menuSelecionado]();
        }
    }

    iniciarMedicao() {
        this.modo = 'medicao';
        this.atualizarDisplay([
            "INICIANDO MEDIÇÃO",
            "Conecte ao pneu",
            "e aguarde...",
            "Analisando..."
        ]);

        // Simular processo de medição com animação
        let dots = 0;
        const animacao = setInterval(() => {
            dots = (dots + 1) % 4;
            const pontos = '.'.repeat(dots);
            this.atualizarDisplay([
                "MEDINDO PRESSÃO",
                "Conectado ao pneu",
                `Processando${pontos}`,
                "Não desconecte"
            ]);
        }, 500);

        // Finalizar medição após 3 segundos
        setTimeout(() => {
            clearInterval(animacao);
            this.realizarMedicao();
        }, 3000);
    }

    realizarMedicao() {
        const pressao = (Math.random() * 15 + 25).toFixed(1);
        const atmosferica = (Math.random() * 30 + 990).toFixed(1);
        const temperatura = (Math.random() * 20 + 15).toFixed(1);

        this.medicaoAtual = { pressao, atmosferica, temperatura };
        
        const status = this.avaliarPressao(pressao);
        
        this.atualizarDisplay([
            "MEDIÇÃO CONCLUÍDA",
            `Pressão: ${pressao} PSI`,
            `Status: ${status}`,
            "[OK] Continuar"
        ]);

        this.adicionarHistorico(pressao, atmosferica, temperatura);
        this.mostrarFeedback(`Medição: ${pressao} PSI`);
    }

    finalizarMedicao() {
        this.voltarPadrao();
    }

    avaliarPressao(pressao) {
        const p = parseFloat(pressao);
        if (p < 28) return "BAIXA ⚠️";
        if (p > 36) return "ALTA ⚠️";
        return "NORMAL ✓";
    }

    configurarVeiculo() {
        this.modo = 'config';
        this.configTipo = 'veiculo';
        this.configIndex = this.menus.veiculos.indexOf(this.config.veiculo);
        if (this.configIndex === -1) this.configIndex = 0;
        this.atualizarDisplayConfig();
    }

    configurarPneu() {
        this.modo = 'config';
        this.configTipo = 'pneu';
        this.configIndex = this.menus.pneus.indexOf(this.config.pneu);
        if (this.configIndex === -1) this.configIndex = 0;
        this.atualizarDisplayConfig();
    }

    configurarCarga() {
        this.modo = 'config';
        this.configTipo = 'carga';
        this.configIndex = this.menus.cargas.indexOf(this.config.carga);
        if (this.configIndex === -1) this.configIndex = 1;
        this.atualizarDisplayConfig();
    }

    atualizarDisplayConfig() {
        const tipos = {
            veiculo: { titulo: "TIPO DE VEÍCULO", opcoes: this.menus.veiculos },
            pneu: { titulo: "TIPO DE PNEU", opcoes: this.menus.pneus },
            carga: { titulo: "CONFIGURAR CARGA", opcoes: this.menus.cargas }
        };
        
        const config = tipos[this.configTipo];
        const linhas = [
            config.titulo,
            `Opção ${this.configIndex + 1}/${config.opcoes.length}`,
            `> ${config.opcoes[this.configIndex]}`,
            "[▲▼] Navegar [OK] Salvar"
        ];
        
        this.atualizarDisplay(linhas);
    }

    alterarConfig(direcao) {
        const tipos = {
            veiculo: this.menus.veiculos,
            pneu: this.menus.pneus,
            carga: this.menus.cargas
        };
        
        const opcoes = tipos[this.configTipo];
        this.configIndex = (this.configIndex + direcao + opcoes.length) % opcoes.length;
        this.atualizarDisplayConfig();
        this.piscarDisplay();
    }

    confirmarConfig() {
        const valores = {
            veiculo: this.menus.veiculos[this.configIndex],
            pneu: this.menus.pneus[this.configIndex],
            carga: this.menus.cargas[this.configIndex]
        };
        
        this.config[this.configTipo] = valores[this.configTipo];
        
        this.atualizarDisplay([
            "CONFIGURAÇÃO SALVA",
            `${valores[this.configTipo]}`,
            "Configuração atualizada",
            "Voltando ao menu..."
        ]);
        
        this.mostrarFeedback(`Config: ${valores[this.configTipo]}`);
        
        setTimeout(() => this.entrarMenu(), 2000);
    }

    verHistorico() {
        if (this.historico.length === 0) {
            this.atualizarDisplay([
                "HISTÓRICO VAZIO",
                "Nenhuma medição",
                "realizada ainda",
                "Voltando ao menu..."
            ]);
        } else {
            const ultima = this.historico[0];
            this.atualizarDisplay([
                "ÚLTIMA MEDIÇÃO",
                `${ultima.pressao} PSI`,
                `${ultima.temperatura}°C - ${ultima.status}`,
                "Voltando ao menu..."
            ]);
        }
        
        setTimeout(() => this.entrarMenu(), 3000);
    }

    configuracoes() {
        this.atualizarDisplay([
            "CONFIGURAÇÕES",
            "Bateria: 85%",
            "Unidade: PSI", 
            "Voltando ao menu..."
        ]);
        
        setTimeout(() => this.entrarMenu(), 3000);
    }

    mostrarPressaoRecomendada() {
        const recomendacoes = {
            'Carro Passeio': '32-35 PSI',
            'SUV/4x4': '35-38 PSI',
            'Motocicleta': '28-32 PSI',
            'Bicicleta': '40-65 PSI'
        };
        
        const recomendacao = recomendacoes[this.config.veiculo] || '30-35 PSI';
        
        this.atualizarDisplay([
            "PRESSÃO IDEAL",
            `${this.config.veiculo}`,
            `${recomendacao}`,
            "Voltando em 3s..."
        ]);
        
        setTimeout(() => this.atualizarDisplayPadrao(), 3000);
    }

    mostrarHistoricoRapido() {
        const total = this.historico.length;
        this.atualizarDisplay([
            "ESTATÍSTICAS",
            `Medições: ${total}`,
            "Use o menu para",
            "ver histórico completo"
        ]);
        
        setTimeout(() => this.atualizarDisplayPadrao(), 3000);
    }

    adicionarHistorico(pressao, atmosferica, temperatura) {
        this.historico.unshift({
            pressao,
            atmosferica,
            temperatura,
            status: this.avaliarPressao(pressao),
            timestamp: new Date().toLocaleTimeString()
        });
        
        if (this.historico.length > 10) {
            this.historico.pop();
        }
    }

    atualizarDisplay(linhas) {
        for (let i = 1; i <= 4; i++) {
            const elemento = document.getElementById(`line${i}`);
            if (elemento && linhas[i - 1]) {
                elemento.textContent = linhas[i - 1];
            }
        }
    }

    atualizarDisplayPadrao() {
        if (this.medicaoAtual) {
            const status = this.avaliarPressao(this.medicaoAtual.pressao);
            this.atualizarDisplay([
                "AFERIDOR ATIVO",
                `Pressão: ${this.medicaoAtual.pressao} PSI`,
                `Status: ${status}`,
                "[OK]Medir ▲▼Nav Duplo:Menu"
            ]);
        } else {
            this.atualizarDisplay([
                "AFERIDOR INTELIGENTE",
                "Modo: PADRÃO",
                "Pressione OK para",
                "medir Duplo: Menu"
            ]);
        }
    }

    atualizarDisplayInicial() {
        this.atualizarDisplay([
            "AFERIDOR INTELIGENTE",
            "Inicializando...",
            "Sistema pronto",
            "[OK] Iniciar"
        ]);
        
        setTimeout(() => this.atualizarDisplayPadrao(), 2000);
    }

    atualizarStatus() {
        const battery = document.getElementById('batteryStatus');
        const mode = document.getElementById('modeStatus');
        const time = document.getElementById('timeStatus');
        
        if (battery) battery.textContent = `🔋 ${Math.floor(Math.random() * 20 + 70)}%`;
        if (mode) mode.textContent = `📊 ${this.modo.charAt(0).toUpperCase() + this.modo.slice(1)}`;
        if (time) time.textContent = `🕒 ${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
    }

    // Novos métodos de feedback
    piscarDisplay() {
        const display = document.querySelector('.display-content');
        display.style.animation = 'blink 0.2s';
        setTimeout(() => display.style.animation = '', 200);
    }

    mostrarFeedback(mensagem) {
        console.log(`Feedback: ${mensagem}`);
        // Poderia adicionar um toast ou som aqui
    }
}

// CSS adicional para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .btn-confirm:active {
        transform: scale(0.95);
        background: linear-gradient(145deg, #cc5500, #994400);
    }
    
    .feedback {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 255, 0, 0.9);
        color: black;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 1000;
    }
`;
document.head.appendChild(style);

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('Aferidor Simulator iniciado!');
    new AferidorRealista();
});