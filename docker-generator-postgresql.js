// Docker Generator - PostgreSQL
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('postgresForm');
    const resultSection = document.getElementById('resultSection');
    const dockerCommandEl = document.getElementById('dockerCommand');
    const copyBtn = document.getElementById('copyBtn');
    const passwordInput = document.getElementById('postgresPassword');
    const passwordStrengthEl = document.getElementById('passwordStrength');

    // Validação de senha em tempo real
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);

        if (password.length === 0) {
            passwordStrengthEl.innerHTML = '';
            passwordStrengthEl.className = 'password-strength';
            return;
        }

        passwordStrengthEl.className = `password-strength ${strength.class}`;
        passwordStrengthEl.innerHTML = `<i class="bi bi-${strength.icon} me-1"></i>${strength.message}`;
    });

    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar senha
        const password = document.getElementById('postgresPassword').value;

        if (password.length < 6) {
            alert('Por favor, utilize uma senha com no mínimo 6 caracteres.');
            return;
        }

        // Gerar comando
        const dockerCommand = generateDockerCommand();

        // Exibir resultado
        dockerCommandEl.textContent = dockerCommand;
        resultSection.style.display = 'block';

        // Scroll suave até o resultado
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Atualizar informações de conexão
        updateConnectionInfo();
    });

    // Copiar comando
    copyBtn.addEventListener('click', function() {
        const command = dockerCommandEl.textContent;

        navigator.clipboard.writeText(command).then(function() {
            // Feedback visual
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Copiado!';
            copyBtn.classList.add('copied');

            setTimeout(function() {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(function(err) {
            alert('Erro ao copiar: ' + err);
        });
    });

    // Função para verificar força da senha
    function checkPasswordStrength(password) {
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const criteriaMet = [hasMinLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

        if (criteriaMet >= 4) {
            return {
                class: 'strong',
                message: 'Senha forte!',
                icon: 'shield-check'
            };
        } else if (criteriaMet >= 2) {
            return {
                class: 'medium',
                message: 'Senha média.',
                icon: 'shield-exclamation'
            };
        } else {
            return {
                class: 'weak',
                message: 'Senha fraca.',
                icon: 'shield-x'
            };
        }
    }

    // Função para gerar o comando Docker
    function generateDockerCommand() {
        const dbName = document.getElementById('dbName').value || 'postgres';
        const postgresPassword = document.getElementById('postgresPassword').value;
        const postgresUser = document.getElementById('postgresUser').value || 'postgres';
        const hostPort = document.getElementById('hostPort').value || '5432';
        const containerName = document.getElementById('containerName').value || 'postgres-dev';
        const hostname = document.getElementById('hostname').value;
        const version = document.getElementById('version').value || 'latest';

        let command = 'docker run';

        // Nome do banco (opcional)
        if (dbName && dbName.trim() !== '') {
            command += ` -e POSTGRES_DB=${dbName}`;
        }

        // Senha (obrigatório)
        command += ` -e POSTGRES_PASSWORD=${postgresPassword}`;

        // Usuário (opcional)
        if (postgresUser && postgresUser.trim() !== '' && postgresUser !== 'postgres') {
            command += ` -e POSTGRES_USER=${postgresUser}`;
        }

        // Porta (padrão 5432)
        command += ` -p ${hostPort}:5432`;

        // Nome do container (opcional)
        if (containerName && containerName.trim() !== '') {
            command += ` --name ${containerName}`;
        }

        // Hostname (opcional)
        if (hostname && hostname.trim() !== '') {
            command += ` --hostname ${hostname}`;
        }

        // Executar em background
        command += ' -d';

        // Imagem do PostgreSQL
        command += ` postgres:${version}`;

        return command;
    }

    // Função para atualizar informações de conexão
    function updateConnectionInfo() {
        const hostPort = document.getElementById('hostPort').value || '5432';
        const postgresPassword = document.getElementById('postgresPassword').value;
        const postgresUser = document.getElementById('postgresUser').value || 'postgres';
        const dbName = document.getElementById('dbName').value || 'postgres';

        // Atualizar porta
        document.getElementById('displayPort').textContent = hostPort;

        // Atualizar usuário
        document.getElementById('displayUser').textContent = postgresUser;

        // Atualizar senha
        document.getElementById('displayPassword').textContent = postgresPassword;

        // Atualizar banco
        document.getElementById('displayDb').textContent = dbName;

        // Gerar string de conexão
        const connectionString = `postgresql://${postgresUser}:${postgresPassword}@localhost:${hostPort}/${dbName}`;
        document.getElementById('connectionString').textContent = connectionString;
    }
});
