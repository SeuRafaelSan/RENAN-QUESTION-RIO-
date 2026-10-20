"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Printer } from "lucide-react";
import { calculate, DiscKey, profiles, questions } from "@/lib/disc";

const scale = ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"];
const initialData = { firstName: "", lastName: "", phone: "", role: "", email: "" };

export default function Assessment() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [consent, setConsent] = useState(false);
  const [answers, setAnswers] = useState<number[]>(Array(40).fill(0));
  const [result, setResult] = useState<null | { scores: Record<DiscKey, number>; dominant: DiscKey }>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const groups = step >= 1 && step <= 4 ? [(step - 1) * 10, step * 10] : [0, 10];

  function start() {
    if (Object.values(data).some((value) => !value.trim())) {
      return setError("Preencha todos os dados para continuar.");
    }
    if (!consent) return setError("Confirme que está ciente do uso das informações.");
    setError("");
    setStep(1);
  }

  async function finish() {
    if (answers.some((value) => !value)) return setError("Responda todas as perguntas antes de finalizar.");
    setBusy(true);
    const calculated = calculate(answers);
    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, answers, ...calculated }),
      });
      if (!response.ok) throw new Error();
      setResult(calculated);
      setStep(5);
      scrollTo(0, 0);
    } catch {
      setError("Não foi possível salvar agora. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="inner-header">
        <div className="wrap">
          <Link href="/"><img src="/madmak-logo.png" alt="MadMak" /></Link>
          <span className="step-note">
            {step === 0 ? "Identificação" : step <= 4 ? `Perguntas ${groups[0] + 1}–${groups[1]}` : "Seu resultado"}
          </span>
        </div>
      </header>

      <div className="form-wrap">
        {step === 0 && (
          <>
            <h1>Identificação do participante</h1>
            <p>Preencha seus dados profissionais. As informações serão utilizadas pela MadMak exclusivamente para acompanhamento e desenvolvimento da equipe.</p>
            <section className="panel fields">
              {[
                ["firstName", "Nome", "Digite seu nome"],
                ["lastName", "Sobrenome", "Digite seu sobrenome"],
                ["phone", "Telefone", "(00) 00000-0000"],
                ["role", "Função", "Informe sua função"],
                ["email", "E-mail", "nome@exemplo.com"],
              ].map(([key, label, placeholder], index) => (
                <div className={`field ${index === 4 ? "full" : ""}`} key={key}>
                  <label>{label}</label>
                  <input
                    type={key === "email" ? "email" : "text"}
                    placeholder={placeholder}
                    value={data[key as keyof typeof data]}
                    onChange={(event) => setData({ ...data, [key]: event.target.value })}
                  />
                </div>
              ))}
              <label className="consent full">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                <span>Estou ciente de que estas informações e o resultado da avaliação serão acessados pela administração da MadMak para fins de desenvolvimento da equipe.</span>
              </label>
            </section>
            {error && <p className="error">{error}</p>}
            <div className="action-row">
              <span />
              <button className="button primary" onClick={start}>Começar avaliação <ArrowRight size={17} /></button>
            </div>
          </>
        )}

        {step >= 1 && step <= 4 && (
          <>
            <h1>Como você costuma agir?</h1>
            <p>Indique o quanto cada afirmação representa seu jeito natural de agir. Responda com sinceridade: não existem respostas certas ou melhores para a empresa.</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(answers.filter(Boolean).length / 40) * 100}%` }} />
            </div>
            <section className="panel">
              {questions.slice(groups[0], groups[1]).map((question, position) => {
                const index = groups[0] + position;
                return (
                  <div className="question" key={index}>
                    <h3>{index + 1}. {question.text}</h3>
                    <div className="scale">
                      {scale.map((label, value) => (
                        <label key={label} title={label}>
                          <input
                            type="radio"
                            name={`q${index}`}
                            checked={answers[index] === value + 1}
                            onChange={() => {
                              const next = [...answers];
                              next[index] = value + 1;
                              setAnswers(next);
                              setError("");
                            }}
                          />
                          {value + 1}
                        </label>
                      ))}
                    </div>
                    <div className="scale-caption"><span>Discordo totalmente</span><span>Concordo totalmente</span></div>
                  </div>
                );
              })}
            </section>
            {error && <p className="error">{error}</p>}
            <div className="action-row">
              <button className="button secondary" onClick={() => setStep(step - 1)}><ArrowLeft size={17} /> Voltar</button>
              {step < 4 ? (
                <button className="button primary" onClick={() => {
                  if (answers.slice(groups[0], groups[1]).some((value) => !value)) return setError("Responda as 10 perguntas desta etapa.");
                  setError("");
                  setStep(step + 1);
                  scrollTo(0, 0);
                }}>Próxima etapa <ArrowRight size={17} /></button>
              ) : (
                <button disabled={busy} className="button primary" onClick={finish}>
                  <Check size={17} />{busy ? "Salvando..." : "Finalizar avaliação"}
                </button>
              )}
            </div>
          </>
        )}

        {step === 5 && result && <Result data={data} result={result} />}
      </div>
    </main>
  );
}

function Result({ data, result }: {
  data: { firstName: string; lastName: string; role: string };
  result: { scores: Record<DiscKey, number>; dominant: DiscKey };
}) {
  const profile = profiles[result.dominant];
  return (
    <>
      <section className="panel">
        <div className="result-hero">
          <div className="result-letter" style={{ background: profile.color }}>{result.dominant}</div>
          <h1>{data.firstName}, seu perfil predominante é {profile.name}</h1>
          <p>Palavra que melhor representa sua tendência: <strong>{profile.word}</strong></p>
        </div>
        <div className="bars">
          {(Object.keys(result.scores) as DiscKey[]).map((key) => (
            <div key={key}>
              <div className="bar-head"><span>{key} • {profiles[key].name}</span><b>{result.scores[key]}%</b></div>
              <div className="bar-track"><span style={{ width: `${result.scores[key]}%`, background: profiles[key].color }} /></div>
            </div>
          ))}
        </div>
        <p className="result-copy">{profile.summary}</p>
        <p className="result-copy"><strong>Importante:</strong> este resultado apresenta tendências de comportamento e deve ser interpretado como apoio ao autoconhecimento, não como diagnóstico psicológico.</p>
      </section>
      <div className="action-row no-print">
        <Link className="button secondary" href="/">Voltar ao início</Link>
        <button className="button primary" onClick={() => window.print()}><Printer size={17} /> Baixar relatório em PDF</button>
      </div>
    </>
  );
}
