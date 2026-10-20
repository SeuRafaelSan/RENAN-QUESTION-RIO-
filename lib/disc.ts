export type DiscKey = "D" | "I" | "S" | "C";
export type DiscQuestion = { text: string; type: DiscKey; reverse?: boolean };

export const questions: DiscQuestion[] = [
  { text: "Sinto-me confortável assumindo a decisão final.", type: "D" },
  { text: "Prefiro esperar por mais informações antes de agir rapidamente.", type: "D", reverse: true },
  { text: "Metas competitivas costumam aumentar minha motivação.", type: "D" },
  { text: "Quando há discordância, prefiro não confrontar diretamente o assunto.", type: "D", reverse: true },
  { text: "Em situações indefinidas, costumo tomar a iniciativa.", type: "D" },
  { text: "Prefiro buscar consenso, mesmo quando a decisão demora mais.", type: "D", reverse: true },
  { text: "Consigo dizer com objetividade o que precisa mudar.", type: "D" },
  { text: "Sinto desconforto quando preciso cobrar prazos de outras pessoas.", type: "D", reverse: true },
  { text: "Ter autonomia para escolher caminhos aumenta meu envolvimento.", type: "D" },
  { text: "Normalmente deixo que outras pessoas definam as prioridades.", type: "D", reverse: true },

  { text: "Interagir com várias pessoas ao longo do dia aumenta minha energia.", type: "I" },
  { text: "Prefiro comunicar uma ideia por escrito em vez de conversar sobre ela.", type: "I", reverse: true },
  { text: "É natural para mim iniciar conversas em grupos novos.", type: "I" },
  { text: "Costumo guardar minhas ideias até que estejam completamente organizadas.", type: "I", reverse: true },
  { text: "Expresso entusiasmo com facilidade quando acredito em uma proposta.", type: "I" },
  { text: "Em ambientes desconhecidos, geralmente permaneço mais reservado.", type: "I", reverse: true },
  { text: "Tenho facilidade para envolver pessoas por meio da conversa.", type: "I" },
  { text: "Evito situações em que preciso chamar a atenção do grupo.", type: "I", reverse: true },
  { text: "Gosto de reconhecer conquistas e celebrá-las com outras pessoas.", type: "I" },
  { text: "No trabalho, procuro limitar as conversas apenas ao necessário.", type: "I", reverse: true },

  { text: "Trabalho melhor quando consigo manter um ritmo constante.", type: "S" },
  { text: "Mudanças frequentes de rotina costumam manter meu interesse.", type: "S", reverse: true },
  { text: "Tenho paciência quando alguém precisa de mais tempo para compreender algo.", type: "S" },
  { text: "Fico inquieto quando permaneço muito tempo no mesmo processo.", type: "S", reverse: true },
  { text: "Procuro preservar a harmonia mesmo quando existem opiniões diferentes.", type: "S" },
  { text: "Prefiro implementar mudanças de uma vez, sem muitas etapas intermediárias.", type: "S", reverse: true },
  { text: "As pessoas costumam encontrar em mim alguém disposto a escutar.", type: "S" },
  { text: "Consigo trocar de prioridade várias vezes no mesmo dia sem desconforto.", type: "S", reverse: true },
  { text: "Relações estáveis e previsíveis aumentam minha confiança no trabalho.", type: "S" },
  { text: "Interrupções inesperadas raramente afetam meu ritmo.", type: "S", reverse: true },

  { text: "Costumo revisar detalhes antes de considerar uma tarefa concluída.", type: "C" },
  { text: "Consigo entregar um trabalho mesmo sem verificar cada detalhe.", type: "C", reverse: true },
  { text: "Critérios e procedimentos claros facilitam meu desempenho.", type: "C" },
  { text: "Quando faltam dados, sinto-me confortável decidindo pela intuição.", type: "C", reverse: true },
  { text: "Gosto de registrar informações para poder consultá-las depois.", type: "C" },
  { text: "Adapto procedimentos espontaneamente quando isso parece mais prático.", type: "C", reverse: true },
  { text: "Percebo rapidamente inconsistências em informações ou processos.", type: "C" },
  { text: "Para mim, flexibilidade costuma ser mais importante que precisão.", type: "C", reverse: true },
  { text: "Prefiro me preparar bem antes de executar uma atividade nova.", type: "C" },
  { text: "Pequenos erros raramente chamam minha atenção.", type: "C", reverse: true },
];

export const profiles: Record<DiscKey, { name: string; word: string; color: string; summary: string }> = {
  D: { name: "Dominância", word: "Realizador", color: "#df5549", summary: "Você tende a agir com objetividade, rapidez e foco em resultados. Sente-se estimulado por desafios e autonomia. Em equipe, sua firmeza ajuda a transformar decisões em movimento." },
  I: { name: "Influência", word: "Mobilizador", color: "#e7a72d", summary: "Você tende a se comunicar com entusiasmo, criar conexões e engajar pessoas. Em equipe, sua energia favorece a colaboração, a persuasão e um ambiente mais aberto." },
  S: { name: "Estabilidade", word: "Apoiador", color: "#4e9a61", summary: "Você tende a demonstrar paciência, constância e atenção às relações. Em equipe, contribui com escuta, confiança e continuidade mesmo em momentos de pressão." },
  C: { name: "Conformidade", word: "Analista", color: "#4380b8", summary: "Você tende a valorizar precisão, critérios e qualidade. Em equipe, sua análise cuidadosa reduz riscos, organiza processos e sustenta decisões bem fundamentadas." },
};

export function calculate(answers: number[]) {
  const raw: Record<DiscKey, number> = { D: 0, I: 0, S: 0, C: 0 };
  questions.forEach((question, index) => {
    const answer = answers[index] || 3;
    raw[question.type] += question.reverse ? 6 - answer : answer;
  });

  const evidence = Object.fromEntries(
    (Object.keys(raw) as DiscKey[]).map((key) => [key, Math.max(1, raw[key] - 10)])
  ) as Record<DiscKey, number>;
  const total = Object.values(evidence).reduce((sum, value) => sum + value, 0);
  const keys = Object.keys(evidence) as DiscKey[];
  const scores = Object.fromEntries(keys.map((key) => [key, Math.round((evidence[key] / total) * 1000) / 10])) as Record<DiscKey, number>;
  const roundingDifference = Math.round((100 - Object.values(scores).reduce((sum, value) => sum + value, 0)) * 10) / 10;
  const dominant = [...keys].sort((a, b) => scores[b] - scores[a])[0];
  scores[dominant] = Math.round((scores[dominant] + roundingDifference) * 10) / 10;
  return { scores, dominant };
}
