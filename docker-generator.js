// Docker Generator - SQL Server 2022
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sqlServerForm');
    const resultSection = document.getElementById('resultSection');
    const dockerCommandEl = document.getElementById('dockerCommand');
    const copyBtn = document.getElementById('copyBtn');
    const passwordInput = document.getElementById('saPassword');
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
        const password = document.getElementById('saPassword').value;
        const strength = checkPasswordStrength(password);

        if (strength.class !== 'strong') {
            alert('Por favor, utilize uma senha forte (mínimo 8 caracteres com letras maiúsculas, minúsculas, números e caracteres especiais).');
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

        if (criteriaMet === 5) {
            return {
                class: 'strong',
                message: 'Senha forte! Atende todos os requisitos.',
                icon: 'shield-check'
            };
        } else if (criteriaMet >= 3) {
            return {
                class: 'medium',
                message: 'Senha média. Adicione mais caracteres especiais ou números.',
                icon: 'shield-exclamation'
            };
        } else {
            return {
                class: 'weak',
                message: 'Senha fraca. Use letras maiúsculas, minúsculas, números e caracteres especiais.',
                icon: 'shield-x'
            };
        }
    }

    // Função para gerar o comando Docker
    function generateDockerCommand() {
        const acceptEula = document.getElementById('acceptEula').value;
        const saPassword = document.getElementById('saPassword').value;
        const collation = document.getElementById('collation').value;
        const hostPort = document.getElementById('hostPort').value || '1433';
        const containerName = document.getElementById('containerName').value || 'sqlserver2022';
        const hostname = document.getElementById('hostname').value;
        const edition = document.getElementById('edition').value;

        let command = 'docker run -e "ACCEPT_EULA=Y"';

        // Senha SA (obrigatório)
        command += ` -e "MSSQL_SA_PASSWORD=${saPassword}"`;

        // Collation (opcional)
        if (collation && collation.trim() !== '') {
            command += ` -e "MSSQL_COLLATION=${collation}"`;
        }

        // Edição (opcional)
        if (edition && edition.trim() !== '') {
            command += ` -e "MSSQL_PID=${edition}"`;
        }

        // Porta (padrão 1433)
        command += ` -p ${hostPort}:1433`;

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

        // Imagem do SQL Server 2022
        command += ' mcr.microsoft.com/mssql/server:2022-latest';

        return command;
    }

    // Função para atualizar informações de conexão
    function updateConnectionInfo() {
        const hostPort = document.getElementById('hostPort').value || '1433';
        const saPassword = document.getElementById('saPassword').value;

        // Atualizar porta
        document.getElementById('displayPort').textContent = hostPort;

        // Atualizar senha
        document.getElementById('displayPassword').textContent = saPassword;

        // Gerar string de conexão
        const connectionString = `Server=localhost,${hostPort};Database=master;User Id=sa;Password=${saPassword};TrustServerCertificate=True;`;
        document.getElementById('connectionString').textContent = connectionString;
    }
});
