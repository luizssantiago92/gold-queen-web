import type { Messages } from './en'

export const pt: Messages = {
  appName: 'Rainha Dourada',
  appTagline: 'Tesouro do reino',
  pageTitle: 'Rainha Dourada — Tesouro do Reino',

  greetingMorning: 'Bom dia',
  greetingAfternoon: 'Boa tarde',
  greetingEvening: 'Boa noite',
  demoBadge: 'Demo',

  closeModal: 'Fechar',
  transactionGuardedBadge: 'Protegido pela Rainha',
  appLoading: 'Abrindo o tesouro real...',
  demoBannerDismiss: 'Fechar banner',

  demoBannerProduct:
    'Rainha Dourada agrega suas contas via Open Finance e mostra saldo, gastos e categorias do mês em um painel único.',
  demoBannerOpenFinance:
    'A proposta do produto: conectar bancos reais, classificar movimentações e receber orientação patrimonial com IA.',
  demoBannerLimits:
    'Esta demonstração usa dados do Pluggy Sandbox, com limites propositais — incluindo apenas 1 banco conectado.',
  demoBannerQueen:
    'Pergunte à Rainha sobre seu tesouro: respostas com guardrails, sem inventar limites ou dados do app.',
  demoBannerPlan:
    'No plano gratuito: até 3 bancos no tesouro e consultas diárias limitadas à Mestra da Moeda.',

  badgeCourt: 'CORTE REAL',
  logout: 'Sair do reino',
  logoutAria: 'Sair',

  learnWealth: 'Aprenda a gerir seu patrimônio',
  askQueen: 'Pergunte à Rainha',
  navAdvisor: 'Consultora',

  home: 'Início',
  profile: 'Perfil',

  balanceTitle: 'Saldo em contas',
  updatedNow: 'Atualizado agora',
  noBanksYet: 'Nenhum banco no tesouro real ainda.',

  monthIncome: 'Rendas do mês',
  monthExpenses: 'Gastos do mês',
  monthExpensesTitle: 'Gastos do mês',
  categoriesTitle: 'Gastos por categoria',
  categoriesSubtitle: 'este mês',
  category: 'categoria',
  categories: 'categorias',
  noExpensesMonth: 'Sem gastos registrados neste mês.',
  treasuryUntouched: 'O tesouro permanece intocado neste mês.',

  transactionsTitle: 'Movimentações recentes',
  transactionsTotal: '{{count}} no total',
  transactionsEmpty: 'O pergaminho de movimentações está vazio.',

  transactionDetailTitle: 'Detalhes da movimentação',
  transactionAmount: 'Valor',
  transactionDate: 'Data',
  transactionCategory: 'Categoria',
  transactionBank: 'Banco',
  transactionAccount: 'Conta',
  transactionAccountType: 'Tipo de conta',
  transactionGuarded: 'Categoria validada pelos guardrails da Rainha',
  transactionDetailError: 'Não foi possível carregar os detalhes desta movimentação.',

  connectBank: 'Conectar um banco ao tesouro',
  demoConnectTitle: 'Demonstração do tesouro',
  demoConnectSubtitle: 'Open Finance com limites propositais',
  demoConnectBody:
    'Esta versão de demonstração foi preparada para recrutadores e visitantes. A conexão bancária real via Pluggy fica desativada aqui para manter o cenário controlado.',
  demoConnectLimit: 'Limite da demo',
  demoConnectOneBank: 'Apenas 1 banco pode ficar conectado nesta demonstração.',
  demoConnectAlready: '{{bank}} já está conectado ao tesouro real.',
  syncing: 'Recolhendo o extrato real...',
  connectLimit: 'O plano livre permite apenas 3 bancos no tesouro.',
  connectError: 'Não foi possível abrir o portal do Open Finance.',
  syncError: 'O banco respondeu, mas a sincronização falhou.',
  syncSuccess: '{{bank}} juntou-se ao reino com {{count}} movimentações.',
  portalInterrupted: 'O portal do Open Finance foi interrompido. Tente novamente.',

  tipsTitle: 'Orientação patrimonial',
  tipsSubtitle: 'Diagnóstico real do seu tesouro',
  tipsLoading: 'A Rainha consulta os pergaminhos...',
  tipsError: 'Os conselheiros reais estão indisponíveis no momento.',
  tipsCritical: 'Corte de Gastos Crítico',
  tipsManagement: 'Gestão do Tesouro',
  tipsGuidance: 'Direcionamento Inteligente',
  tipsGuarded: 'Resposta validada pelos guardrails',
  tipsCached: ' · recuperada do pergaminho do dia',

  chatTitle: 'Consulte a Rainha Dourada',
  chatSubtitle: 'Soberana e Mestra da Moeda',
  chatRemaining: '{{count}} consultas restantes hoje',
  chatGreeting:
    'Falai, nobre. A Mestra da Moeda ouve as vossas dúvidas sobre o ouro do reino.',
  chatThinking: 'A Rainha pondera...',
  chatPlaceholder: 'Pergunte sobre o seu ouro...',
  chatBlocked: 'A Rainha recolheu-se',
  chatError: 'A corte está em silêncio. Tentai novamente em instantes.',
  chatSend: 'Enviar pergunta',

  loginTitle: 'Rainha Dourada',
  loginSubtitle: 'A Mestra da Moeda aguarda para zelar pelo seu tesouro.',
  loginEmail: 'E-mail',
  loginPassword: 'Senha',
  loginSubmit: 'Entrar',
  loginPending: 'Abrindo os portões...',
  loginError: 'Os guardas do reino não reconheceram estas credenciais.',
  loginSlow:
    'O servidor gratuito estava dormindo e pode levar cerca de um minuto. Seus dados continuam neste formulário — a Rainha já está a caminho.',
  wakeTitle: 'A corte está acordando',
  wakeBody: 'O servidor gratuito estava dormindo. Preencha o formulário enquanto ele acorda — cerca de um minuto.',
  wakeFailed: 'Não conseguimos acordar o servidor agora.',
  wakeRetry: 'Tentar de novo',
  wakeProgress: 'Progresso ao acordar o servidor',
  loginDemoNote: 'Conta de demonstração já preenchida — dados do Pluggy Sandbox.',
  signupToggle: 'Criar uma conta',
  signupName: 'Nome',
  signupSubmit: 'Criar conta',
  signupPending: 'Abrindo o livro...',
  signupBack: 'Entrar com a conta demo',
  signupError: 'Não foi possível criar a conta.',
  syncConnection: 'Sincronizar',
  removeConnection: 'Remover',
  removeError: 'Não foi possível desligar este banco.',

  profilePlan: 'Grátis',
  profilePlanLabel: 'Plano',
  profileBanks: '{{count}} Banco',
  profileBanksPlural: '{{count}} Bancos',
  profileConnections: 'Conexões',
  profileBannerTitle: 'TESOURO REAL',
  profileBannerBody:
    'Conecte até 3 bancos no plano gratuito e consulte a Rainha sobre o seu ouro.',
  profileBanksTitle: 'Bancos do reino',
  profileCardsTitle: 'Galeria de Cartões',
  profileCardsSoon: 'Artes medievais e cartões Full Art chegam na próxima estação.',
  profileInvestTitle: 'Investimentos',
  profileInvestSoon: 'A Rainha ainda forja os conselhos de investimento. Em breve.',
  profileRate: 'Avalie o Reino',
  profileLeave: 'Deixar o reino',
  profileLanguage: 'Idioma',
  profileLanguageEn: 'Inglês',
  profileLanguagePt: 'Português',
  profileStandard: 'Standard',
  profilePlatinum: 'Platinum',
  profileSoon: 'Em breve',
  noBanksConnected: 'Nenhum banco conectado ao tesouro.',

  coldStart:
    'Os guardas do castelo ainda despertam. Aguardai um instante e tentai novamente.',
}
