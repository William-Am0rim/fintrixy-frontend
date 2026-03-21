"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  Shield,
  Wallet,
  PiggyBank,
  Check,
  Star,
  ArrowRight,
  Users,
  Target,
  ChevronRight,
  MessageSquare,
  Mic,
  FileText,
  Bot,
  Phone,
  Send,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const testimonials = [
  {
    name: "Marina Santos",
    role: "Designer Freelancer",
    content:
      "Uso o WhatsApp pra adicionar despesas enquanto dirijo. A IA entendeu perfeitamente meu áudio e categorizou tudo. Praticidade absurda!",
    avatar: "MS",
    stars: 5,
  },
  {
    name: "Ricardo Oliveira",
    role: "Desenvolvedor Backend",
    content:
      "O resumo mensal é genial. Chega no WhatsApp e já sei exatamente para onde foi cada centavo. Economizei R$800 só no primeiro mês.",
    avatar: "RO",
    stars: 5,
  },
  {
    name: "Fernanda Costa",
    role: "Médica Gestora",
    content:
      "Minha rotina é correria. Só mandar um áudio e está lá, registrado. A IA até me lembra de gastos que esqueci. Simplesmente perfeito.",
    avatar: "FC",
    stars: 5,
  },
];

const stats = [
  { value: "50.000+", label: "Usuários Ativos", icon: Users },
  { value: "R$12M+", label: "Gerenciados Mensalmente", icon: Wallet },
  { value: "98%", label: "Satisfação", icon: Star },
  { value: "4.9", label: "Nota na App Store", icon: Target },
];

const features = [
  {
    icon: Bot,
    title: "IA no WhatsApp",
    description:
      "Converse com sua assistente financeira pelo WhatsApp. Ela entende português, contextos e aprende seu perfil.",
    highlight: true,
  },
  {
    icon: Mic,
    title: "Mande Áudios",
    description:
      "Relaxa no trânsito ou sambilhar. Mande um áudio dizendo 'Gastei 50 reais no almoço' e pronto, registrado.",
    highlight: true,
  },
  {
    icon: FileText,
    title: "Relatório Mensal",
    description:
      "Todo dia 1, receba no WhatsApp um relatório completo do seu mês: entradas, saídas, análises e dicas.",
    highlight: true,
  },
  {
    icon: TrendingUp,
    title: "Controle de Gastos",
    description:
      "Categorização automática com IA. Gráficos que mostram para onde seu dinheiro vai.",
  },
  {
    icon: PiggyBank,
    title: "Metas de Economia",
    description:
      "Defina objetivos e acompanhe. A IA sugere quanto guardar baseado no seu perfil e hábitos.",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description:
      "Criptografia bancária. Seus dados nunca são compartilhados. Você é dono das suas informações.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Conecte seu WhatsApp",
    description:
      "Escaneie o QR Code e vincule seu número. Tudo criptografado e seguro.",
    icon: Smartphone,
  },
  {
    step: "02",
    title: "Mande um Áudio",
    description:
      "'IA, gastei 120 reais no mercado' ou 'Quanto gastei com delivery esse mês?'",
    icon: Mic,
  },
  {
    step: "03",
    title: "Receba seu Resumo",
    description:
      "Todo dia 1, receba um relatório detalhado com análises e insights personalizados.",
    icon: FileText,
  },
];

const faqs = [
  {
    question: "Como a IA entende meus áudios?",
    answer:
      "Usamos tecnologia de reconhecimento de voz avançada combinada com processamento de linguagem natural. A IA entende gírias, contextos e até erros de fala. Quanto mais você usa, melhor ela fica.",
  },
  {
    question: "Meus dados estão seguros no WhatsApp?",
    answer:
      "Absolutamente! Todos os dados são criptografados de ponta a ponta. Não vendemos informações e seguimos LGPD rigorosamente. Você pode excluir seus dados a qualquer momento.",
  },
  {
    question: "Posso usar sem internet?",
    answer:
      "O app principal precisa de internet. Mas você pode usar o WhatsApp normalmente. A sincronização acontece quando você tiver conexão.",
  },
  {
    question: "Funciona com qualquer banco?",
    answer:
      "Você cadastra manualmente ou importa extratos. A importação automática de bancos estará disponível em breve.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim, sem compromisso. Cancele quando quiser, sem multas ou burocracia. Seu dinheiro é seu.",
  },
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Gradient Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-[128px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Fintrixy
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <Link href="/sign-in" target="_blank">Entrar</Link>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-600 cursor-pointer"
            >
              <Link href="/sign-in" target="_blank">Começar Grátis</Link>
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                IA + WhatsApp = Finanças sem esforço
                <ChevronRight className="w-4 h-4" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                Controle suas finanças
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  pelo WhatsApp
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
              >
                Mande um áudio, peça um resumo ou tire dúvidas. Nossa IA
                faz todo o trabalho pesado enquanto você foca no que importa.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
              >
                <Button
                  size="lg"
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/25 text-lg font-semibold cursor-pointer"
                >
                  <Link href="/sign-in" target="_blank" className="flex items-center">
                    Experimentar Grátis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground mt-6 flex items-center justify-center lg:justify-start gap-2"
              >
                <Check className="w-4 h-4 text-green-500" />
                Sem cartão de crédito • Setup em 2 minutos
              </motion.p>
            </div>

            {/* Hero Illustration - WhatsApp Chat */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mx-auto max-w-md"
            >
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-3xl p-1">
                <div className="bg-background rounded-2xl border shadow-2xl overflow-hidden">
                  {/* WhatsApp Header */}
                  <div className="bg-green-600 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Fintrixy AI</p>
                      <p className="text-green-100 text-xs">online</p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-4 space-y-4 min-h-[320px]">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-green-100 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                        <p className="text-sm">Gastei 85 reais no mercado</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                        <p className="text-sm">
                          <span className="font-semibold text-blue-600">
                            Registrado! ✓
                          </span>
                          <br />
                          Categoria: Alimentação
                          <br />
                          Saldo atual: R$ 2.345,00
                        </p>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-green-100 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                        <p className="text-sm">Qual meu gasto com delivery?</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                        <p className="text-sm">
                          <span className="font-semibold text-blue-600">
                            Resumo Delivery:
                          </span>
                          <br />
                          <span className="text-red-500">
                            R$ 487,50 esse mês
                          </span>
                          <br />
                          <span className="text-xs text-muted-foreground">
                            ↑ 23% vs mês passado
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full px-4 py-2 text-sm text-muted-foreground">
                      Digite uma mensagem...
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                      <Send className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
              >
                <Bot className="w-3 h-3 inline mr-1" />
                IA Ativa
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
              >
                <Phone className="w-3 h-3 inline mr-1" />
                WhatsApp
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 border-y bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-600 font-semibold mb-3">COMO FUNCIONA</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simples assim.
              <br />
              Sem complicação.
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 font-bold text-sm px-3 py-1 rounded-full">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-blue-900/10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-600 font-semibold mb-3">RECURSOS</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Tudo que você precisa,
              <br />
              nada que você não precisa
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Focamos no essencial: uma IA que realmente entende você, relatórios
              que fazem sentido e uma experiência sem fricção.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group p-6 rounded-2xl border bg-card transition-all ${
                  feature.highlight
                    ? "border-2 border-blue-300 dark:border-blue-700 hover:shadow-xl hover:shadow-blue-500/10"
                    : "hover:shadow-lg hover:shadow-blue-500/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${
                    feature.highlight
                      ? "w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500"
                      : "w-12 h-12 bg-blue-100 dark:bg-blue-900/30"
                  }`}>
                    <feature.icon className={`${
                      feature.highlight ? "w-7 h-7 text-white" : "w-6 h-6 text-blue-600"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-bold ${feature.highlight ? "text-xl" : "text-lg"}`}>
                        {feature.title}
                      </h3>
                      {feature.highlight && (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">
                          IA
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-600 font-semibold mb-3">
              DEPOIMENTOS
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Quem usa, aprova
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Veja o que nossos usuários dizem sobre controlar finanças pelo WhatsApp
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 rounded-2xl border bg-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg mb-4 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4" id="pricing">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-600 font-semibold mb-3">PLANOS</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Escolha seu plano
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comece grátis e faça upgrade quando quiser. A IA está incluída em todos os planos.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border bg-card"
            >
              <h3 className="text-xl font-bold mb-2">Gratuito</h3>
              <p className="text-muted-foreground mb-6">
                Para testar e começar
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "50 mensagens de IA/mês",
                  "Relatório mensal básico",
                  "1 carteira",
                  "Categorização automática",
                  "Dashboard simples",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full h-12 cursor-pointer"
              >
                <Link href="/sign-in" target="_blank" className="flex items-center justify-center w-full">
                  Começar Grátis
                </Link>
              </Button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-2xl border-2 border-blue-500 bg-card shadow-xl shadow-blue-500/10"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-full">
                Mais Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground mb-6">
                Para controle total
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 10</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Mensagens de IA ilimitadas",
                  "Relatório mensal detalhado",
                  "Múltiplas carteiras",
                  "Análise com IA avançada",
                  "Alertas personalizados",
                  "Exportação PDF",
                  "Metas de economia",
                  "Suporte prioritário",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-600 cursor-pointer">
                <Link href="/sign-in" target="_blank" className="flex items-center justify-center w-full">
                  Assinar Pro
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            <Shield className="w-4 h-4 inline mr-1" />
            Garantia de 7 dias ou seu dinheiro de volta. Cancele quando quiser.
          </motion.p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-blue-600 font-semibold mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Perguntas Frequentes
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 p-12 text-center text-white"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Sua assistente financeira
                <br />
                está te esperando
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Comece a controlar suas finanças hoje. Mande seu primeiro áudio
                e sinta a diferença.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="h-14 px-10 bg-white text-blue-600 hover:bg-white/90 shadow-xl text-lg font-semibold cursor-pointer"
                >
                  <Link href="/sign-in" target="_blank" className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Começar pelo WhatsApp
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-white/60 mt-6">
                Sem cartão de crédito • Setup em 2 minutos
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Fintrixy</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Controle suas finanças pelo WhatsApp com IA. Simples, rápido e
                inteligente.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  IA no WhatsApp
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Preços
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Funcionalidades
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Como funciona
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Sobre nós
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Blog
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Carreiras
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Contato
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Privacidade
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Termos de uso
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  LGPD
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Segurança
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Fintrixy. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                <span className="text-sm">𝕏</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                <span className="text-sm">in</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                <span className="text-sm">ig</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
