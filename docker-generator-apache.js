// Docker Generator - Apache HTTP Server
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('apacheForm');
    const resultSection = document.getElementById('resultSection');
    const dockerCommandEl = document.getElementById('dockerCommand');
    const copyBtn = document.getElementById('copyBtn');

    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();

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

    // Função para gerar o comando Docker
    function generateDockerCommand() {
        const httpPort = document.getElementById('httpPort').value || '8080';
        const httpsPort = document.getElementById('httpsPort').value || '8443';
        const documentRoot = document.getElementById('documentRoot').value;
        const containerName = document.getElementById('containerName').value || 'apache-server';
        const hostname = document.getElementById('hostname').value;
        const serverName = document.getElementById('serverName').value;
        const version = document.getElementById('version').value || 'latest';

        let command = 'docker run';

        // Porta HTTP
        command += ` -p ${httpPort}:80`;

        // Porta HTTPS
        command += ` -p ${httpsPort}:443`;

        // Volume para document root (opcional)
        if (documentRoot && documentRoot.trim() !== '') {
            // Detectar se é Windows (contém : ou \)
            const isWindows = documentRoot.includes('\\') || (documentRoot.includes(':') && !documentRoot.startsWith('/'));

            if (isWindows) {
                // Converter caminho Windows para formato Docker
                let dockerPath = documentRoot.replace(/\\/g, '/');
                // Se não começar com /, adicionar
                if (!dockerPath.startsWith('/')) {
                    dockerPath = '/' + dockerPath;
                }
                command += ` -v "${dockerPath}:/usr/local/apache2/htdocs"`;
            } else {
                // Caminho Linux/Mac
                command += ` -v "${documentRoot}:/usr/local/apache2/htdocs"`;
            }
        }

        // Server Name (variável de ambiente)
        if (serverName && serverName.trim() !== '') {
            command += ` -e APACHE_SERVER_NAME=${serverName}`;
        }

        // Nome do container
        if (containerName && containerName.trim() !== '') {
            command += ` --name ${containerName}`;
        }

        // Hostname (opcional)
        if (hostname && hostname.trim() !== '') {
            command += ` --hostname ${hostname}`;
        }

        // Executar em background
        command += ' -d';

        // Imagem do Apache
        command += ` httpd:${version}`;

        return command;
    }

    // Função para atualizar informações de conexão
    function updateConnectionInfo() {
        const httpPort = document.getElementById('httpPort').value || '8080';
        const httpsPort = document.getElementById('httpsPort').value || '8443';
        const documentRoot = document.getElementById('documentRoot').value;

        // Atualizar portas
        document.getElementById('displayHttpPort').textContent = httpPort;
        document.getElementById('displayHttpsPort').textContent = httpsPort;

        // Mostrar document root se fornecido
        if (documentRoot && documentRoot.trim() !== '') {
            document.getElementById('documentRootInfo').style.display = 'block';
            document.getElementById('displayDocRoot').textContent = documentRoot;
        } else {
            document.getElementById('documentRootInfo').style.display = 'none';
        }
    }
});
