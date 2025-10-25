document.addEventListener('DOMContentLoaded', () => {
    const numeroInput = document.getElementById('numero');
    const mensagemInput = document.getElementById('mensagem');
    const gerarBtn = document.getElementById('gerar-link');
    const copiarBtn = document.getElementById('copiar-link');
    const resetBtn = document.getElementById('resetar-gerador'); 
    const statusConsole = document.getElementById('status-console');
    const resultadoDiv = document.getElementById('resultado-link');

    // Inicializa: Garante que os botões de ação (copiar e resetar) estejam ocultos no início
    copiarBtn.style.display = 'none';
    resetBtn.style.display = 'none'; // GARANTE QUE O RESET TAMBÉM COMEÇA OCULTO

    // Helper para exibir mensagens no console
    function logStatus(message, type = 'default') {
        statusConsole.textContent = message;
        statusConsole.className = 'status-info-console';
        // Resetamos a cor para laranja antes de adicionar classes de erro/sucesso
        statusConsole.style.color = 'var(--laranja-principal, #FF6600)';
        
        if (type === 'error') {
            statusConsole.classList.add('error');
            statusConsole.style.color = 'var(--texto-erro, #F44336)';
        } else if (type === 'success') {
            statusConsole.classList.add('success');
            statusConsole.style.color = 'var(--texto-sucesso, #4CAF50)';
        }
    }

    // 1. Lógica da Máscara do Telefone
    numeroInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); 
        let maskedValue = '';

        if (value.length > 0) {
            maskedValue += '(' + value.substring(0, 2);
        }
        if (value.length > 2) {
            maskedValue += ') ' + value.substring(2, 7);
        }
        if (value.length > 7) {
            maskedValue += '-' + value.substring(7, 11);
        }

        e.target.value = maskedValue;
    });

    // 2. Lógica de Geração do Link
    gerarBtn.addEventListener('click', gerarLink);

    function gerarLink() {
        const mensagem = mensagemInput.value.trim();
        let numeroLimpo = numeroInput.value.replace(/\D/g, ''); 
        
        // Limpeza do status e ocultar botões de ação antes da validação
        copiarBtn.style.display = 'none';
        resetBtn.style.display = 'none'; // OCULTA O RESET TAMBÉM
        logStatus('Processando...');

        // Validação
        if (numeroLimpo.length !== 11) {
            // Reseta o texto da caixa de resultado para o placeholder
            resultadoDiv.innerHTML = 'Seu link aparecerá aqui'; 
            logStatus('[ERROR] Insira um número de 11 dígitos (DDD + 9º dígito).', 'error');
            
            // Permite resetar após o erro (opcional, mas bom para usabilidade)
            resetBtn.style.display = 'block'; 
            return;
        }

        // Criação do Link
        const mensagemCodificada = encodeURIComponent(mensagem);
        let linkGerado = `https://wa.me/55${numeroLimpo}`; 
        if (mensagemCodificada) {
            linkGerado += `?text=${mensagemCodificada}`;
        }

        // Exibir o resultado
        resultadoDiv.innerHTML = `<a href="${linkGerado}" target="_blank">${linkGerado}</a>`;
        resultadoDiv.dataset.link = linkGerado; 
        
        // MOSTRA AMBOS OS BOTÕES (Copiar Link e Gerar Novamente)
        copiarBtn.style.display = 'block'; 
        resetBtn.style.display = 'block'; 
        logStatus('[SUCCESS] Link gerado com sucesso.', 'success');
    }

    // 3. Lógica de Cópia
    copiarBtn.addEventListener('click', copiarLink);

    function copiarLink() {
        const linkParaCopiar = resultadoDiv.dataset.link;
        
        if (!linkParaCopiar) return;

        navigator.clipboard.writeText(linkParaCopiar).then(() => {
            logStatus('[INFO] Link copiado para a área de transferência.', 'success');
        }).catch(err => {
            logStatus('[ERROR] Falha ao copiar. Copie o texto manualmente.', 'error');
        });
    }
    
    // 4. Lógica de Reset
    resetBtn.addEventListener('click', resetarGerador);

    function resetarGerador() {
        // Limpa os campos de input
        numeroInput.value = '';
        mensagemInput.value = '';
        
        // Reseta o display
        resultadoDiv.innerHTML = 'Seu link aparecerá aqui';
        copiarBtn.style.display = 'none';
        resetBtn.style.display = 'none'; // Garante que o botão de reset desaparece até o próximo uso
        
        // Retorna o status inicial
        logStatus('Gerador resetado. Pronto para gerar seu link.', 'default');
    }

    // Status inicial
    logStatus('Pronto para gerar seu link.', 'default');
});