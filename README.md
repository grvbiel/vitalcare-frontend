# 🏥 VitalCare Frontend

Interface web do VitalCare - Sistema de agendamento de consultas médicas para saúde pública no Brasil.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Uso](#uso)
- [Funcionalidades](#funcionalidades)
- [Integração com Backend](#integração-com-backend)

## 🎯 Visão Geral

Frontend desenvolvido em React + TypeScript com Material-UI para proporcionar uma experiência moderna e acessível para o sistema VitalCare.

### Funcionalidades Principais

- ✅ Login de usuários e administradores
- ✅ Dashboard administrativo com estatísticas em tempo real
- ✅ Gráficos interativos (pizza, barras, linhas)
- ✅ Interface responsiva e acessível
- ✅ Validação de formulários
- ✅ Tratamento de erros e feedback visual
- ✅ Sistema de autenticação com JWT

## 🛠 Tecnologias

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Material-UI (MUI)** - Componentes UI
- **React Router** - Navegação
- **React Hook Form** - Formulários
- **Yup** - Validação
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos
- **React Toastify** - Notificações
- **React Query** - Gerenciamento de estado do servidor

## 📁 Estrutura do Projeto

```
frontend/
├── public/                 # Arquivos estáticos
│   └── index.html         # Template HTML
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── LoginForm.tsx
│   │   └── Dashboard.tsx
│   ├── pages/            # Páginas da aplicação
│   │   ├── LoginPage.tsx
│   │   └── DashboardPage.tsx
│   ├── contexts/         # Contextos React
│   │   └── AuthContext.tsx
│   ├── services/         # Serviços de API
│   │   └── api.ts
│   ├── types/            # Tipos TypeScript
│   │   └── index.ts
│   ├── hooks/            # Hooks personalizados
│   ├── utils/            # Utilitários
│   ├── App.tsx           # Componente principal
│   ├── index.tsx         # Ponto de entrada
│   └── index.css         # Estilos globais
├── package.json          # Dependências
├── tsconfig.json         # Configuração TypeScript
└── README.md             # Documentação
```

## 🚀 Instalação

### Pré-requisitos

- Node.js >= 16.0.0
- npm >= 8.0.0

### Passos

1. **Clone o repositório**
   ```bash
   git clone <repositório-frontend>
   cd vitalcare-frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com as configurações
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

5. **Abra o navegador**
   ```
   http://localhost:3000
   ```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL da API Backend
REACT_APP_API_URL=http://localhost:3001/api

# Configurações opcionais
REACT_APP_API_TIMEOUT=10000
REACT_APP_ENABLE_LOGGING=true
```

### Configuração do Backend

O frontend espera que o backend esteja rodando em `http://localhost:3001`. Para alterar:

1. Modifique a variável `REACT_APP_API_URL` no `.env`
2. Ou configure o proxy no `package.json`

## 🎨 Funcionalidades

### 🔐 Autenticação

- **Login**: Formulário com validação em tempo real
- **Tokens**: Armazenamento seguro de JWT
- **Sessão**: Persistência de login
- **Logout**: Limpeza segura de dados

### 📊 Dashboard Administrativo

- **Estatísticas**: Cards com métricas principais
- **Gráficos**: Visualizações interativas
  - Pizza: Status das consultas
  - Barras: Usuários por tipo
  - Linhas: Consultas por mês
- **Alertas**: Sistema de notificações
- **Listas**: Usuários e consultas recentes

### 🎨 Interface

- **Design**: Material Design
- **Responsivo**: Adapta-se a todos os dispositivos
- **Acessível**: Segue WCAG 2.1
- **Temas**: Suporte a temas claro/escuro
- **Feedback**: Toast notifications

## 🔗 Integração com Backend

### Endpoints da API

O frontend se comunica com os seguintes endpoints:

#### Autenticação
- `POST /login` - Login de usuário
- `POST /validate-token` - Validar token
- `GET /profile` - Perfil do usuário
- `POST /logout` - Logout

#### Administrativo
- `GET /admin/dashboard` - Dashboard completo
- `GET /admin/stats` - Estatísticas
- `GET /admin/users` - Lista de usuários
- `GET /admin/appointments` - Lista de consultas
- `GET /admin/alerts` - Alertas do sistema
- `GET /admin/charts` - Dados para gráficos

### Fluxo de Autenticação

1. **Login**: Credenciais → Backend → Token JWT
2. **Armazenamento**: Token salvo no localStorage
3. **Requisições**: Token incluído nos headers
4. **Validação**: Token verificado em cada requisição
5. **Expiração**: Redirecionamento automático para login

### Tratamento de Erros

- **401**: Token inválido/expirado → Logout automático
- **403**: Acesso negado → Mensagem de erro
- **500**: Erro do servidor → Mensagem amigável
- **Network**: Falha de conexão → Retry automático

## 🧪 Testes

### Testes Manuais

1. **Teste de Login**:
   ```bash
   # Usuário comum
   Email: joao@vitalcare.com
   Senha: senha123
   
   # Administrador
   Email: admin@vitalcare.com
   Senha: admin123
   ```

2. **Teste de Dashboard**:
   - Faça login como admin
   - Verifique se os gráficos carregam
   - Teste as estatísticas
   - Verifique as listas recentes

3. **Teste de Responsividade**:
   - Redimensione o navegador
   - Teste em dispositivos móveis
   - Verifique layout em diferentes telas

### Testes Automáticos

```bash
# Executar testes
npm test

# Testes com coverage
npm run test:coverage

# Linting
npm run lint

# Formatação
npm run format
```

## 🚀 Build e Deploy

### Build para Produção

```bash
# Criar build otimizado
npm run build

# O build será gerado na pasta /build
```

### Deploy

#### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build
npm run build

# Upload da pasta /build para Netlify
```

#### Docker
```dockerfile
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Desenvolvimento

### Estrutura de Componentes

- **Componentes Funcionais**: Com hooks React
- **TypeScript**: Tipagem completa
- **Material-UI**: Componentes consistentes
- **Custom Hooks**: Lógica reutilizável

### Boas Práticas

- **Clean Code**: Código limpo e documentado
- **DRY**: Não repita código
- **SOLID**: Princípios de design
- **Testing**: Testes automatizados
- **Performance**: Otimizações contínuas

### Padrões Adotados

- **Context API**: Gerenciamento de estado global
- **Custom Hooks**: Lógica compartilhada
- **Composition**: Composição de componentes
- **Error Boundaries**: Tratamento de erros
- **Lazy Loading**: Carregamento sob demanda

## 🐛 Troubleshooting

### Problemas Comuns

**CORS Error**
```bash
# Verifique se o backend está rodando
# Configure CORS no backend
# Verifique a URL da API no .env
```

**Token Inválido**
```bash
# Limpe o localStorage
# Faça login novamente
# Verifique o horário do sistema
```

**Gráficos Não Carregam**
```bash
# Verifique a conexão com backend
# Verifique os dados da API
# Abra o console para erros
```

### Debug

```bash
# Habilitar logs detalhados
REACT_APP_ENABLE_LOGGING=true npm start

# Debug no navegador
# Abra DevTools (F12)
# Verifique aba Console e Network
```

## 📝 Licença

Este projeto está licenciado sob a Licença MIT.

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

- **Issues**: GitHub Issues
- **Email**: contato@vitalcare.com.br
- **Documentação**: README.md completo

---

**VitalCare Frontend © 2024 - Tecnologia para saúde pública brasileira** 🇧🇷
