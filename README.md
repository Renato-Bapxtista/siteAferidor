# TPMS Web Showcase: Site de Apresentação do Projeto

Este repositório contém o código-fonte do site de apresentação do projeto **Sistema de Aferição de Pneus (TPMS) com ESP32**. O objetivo principal deste site é detalhar a arquitetura, os requisitos de hardware e software, e os resultados do projeto de monitoramento de pressão de pneus.

## 🌟 Visão Geral do Projeto

O site serve como um portfólio digital e documentação técnica para o sistema TPMS, que foi desenvolvido utilizando um microcontrolador ESP32.

**Funcionalidades Principais do Site:**

*   **Documentação Técnica:** Detalhamento dos requisitos, pinagem e especificações técnicas do hardware (ESP32, sensores BMP280 e SMP3011, display OLED).
*   **Arquitetura de Software:** Explicação da estrutura de código em C++ e do uso do FreeRTOS e LVGL.
*   **Galeria de Imagens:** Apresentação de fotos do protótipo e da interface gráfica.
*   **Resultados:** Exibição de dados de teste e validação dos requisitos de precisão e latência.

## 💻 Tecnologias Utilizadas

Este projeto de front-end estático foi construído com foco em simplicidade, velocidade e compatibilidade.

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Linguagem** | HTML5 | Estrutura semântica do conteúdo. |
| **Estilização** | CSS3 | Design responsivo e visual moderno. |
| **Interatividade** | JavaScript (Puro) | Pequenas interações e manipulação do DOM. |
| **Framework** | Bootstrap (Opcional) | Para um layout responsivo e componentes pré-estilizados (se aplicável). |

## 🚀 Instalação e Execução Local

Siga os passos abaixo para configurar e visualizar o site em seu ambiente local.

### Pré-requisitos

Você precisará apenas de um navegador web moderno (Chrome, Firefox, Edge, etc.).

### Passos

1.  **Clone o Repositório:**
    ```bash
    git clone [URL_DO_REPOSITORIO]
    cd TPMS-Web-Showcase
    ```

2.  **Abra o Site:**
    *   Localize o arquivo `index.html` na raiz do projeto.
    *   Clique duas vezes no arquivo ou arraste-o para a janela do seu navegador.

O site será carregado imediatamente, pois não requer um servidor web para funcionar (é um projeto estático).

## 📁 Estrutura de Pastas

A estrutura de diretórios segue um padrão simples e intuitivo para projetos estáticos:

```
TPMS-Web-Showcase/
├── index.html          # Página inicial do site
├── assets/
│   ├── css/            # Arquivos de estilo CSS
│   ├── js/             # Arquivos JavaScript para interatividade
│   ├── img/            # Imagens, diagramas e fotos do protótipo
├── pages/              # Páginas secundárias (ex: documentacao.html, sobre.html)
├── README.md           # Este arquivo
```

## 🤝 Contribuição

Contribuições são bem-vindas! Se você encontrar um erro ou tiver sugestões de melhoria na documentação ou no design do site, sinta-se à vontade para abrir uma *Issue* ou enviar um *Pull Request*.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
