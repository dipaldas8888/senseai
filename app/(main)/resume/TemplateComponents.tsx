import React from "react";
import type { ResumeFormData } from "./types";

function period(exp: ResumeFormData["experience"][0]) {
  return exp.current
    ? `${exp.startMonth} ${exp.startYear} – Present`
    : `${exp.startMonth} ${exp.startYear} – ${exp.endMonth} ${exp.endYear}`;
}

// ─── CLASSIC ──────────────────────────────────────────────────────────────────

export function ClassicTemplate({ data }: { data: ResumeFormData }) {
  const s: Record<string, React.CSSProperties> = {
    root: { fontFamily: "Georgia,'Times New Roman',serif", fontSize: 11, color: "#1a1a1a", padding: "36px 44px", background: "#fff", lineHeight: 1.6 },
    name: { fontSize: 22, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 2 },
    role: { fontSize: 11, color: "#555", marginBottom: 6 },
    contact: { fontSize: 10, color: "#666", display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: 12 },
    hr: { borderTop: "2px solid #1a1a1a", margin: "6px 0 10px" },
    thin: { borderTop: "1px solid #ddd", margin: "4px 0 8px" },
    sec: { fontSize: 9.5, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, color: "#444", marginTop: 14, marginBottom: 2 },
    row: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 },
    bold: { fontWeight: 700, fontSize: 11 },
    sub: { fontSize: 10, color: "#666" },
    date: { fontSize: 10, color: "#888", whiteSpace: "nowrap" as const, marginLeft: 8 },
    desc: { fontSize: 10, color: "#444", marginTop: 3, whiteSpace: "pre-wrap" as const, paddingLeft: 4 },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 20px" },
    bullet: { fontSize: 10, color: "#444" },
    pill: { display: "inline-block", border: "1px solid #ccc", borderRadius: 3, padding: "1px 7px", fontSize: 9.5, marginRight: 4, marginBottom: 3, color: "#333" },
  };

  return (
    <div style={s.root} id="resume-preview">
      <div style={s.name}>{data.fullName || "Your Name"}</div>
      {data.targetRole && <div style={s.role}>{data.targetRole}</div>}
      <div style={s.contact}>
        {[data.email, data.phone, data.location, data.linkedin, data.website].filter(Boolean).map((v, i) => <span key={i}>{i > 0 ? "/ " : ""}{v}</span>)}
      </div>
      <div style={s.hr} />

      {data.summary && <><div style={s.sec}>Summary</div><div style={s.thin} /><div style={{ fontSize: 10.5, color: "#333", lineHeight: 1.7, marginBottom: 4 }}>{data.summary}</div></>}

      {data.skills.length > 0 && (
        <><div style={s.sec}>Skills</div><div style={s.thin} />
        <div style={s.grid2}>{data.skills.map((sk, i) => <div key={i} style={s.bullet}>• {sk}</div>)}</div></>
      )}

      {data.experience.some(e => e.company || e.jobTitle) && (
        <><div style={s.sec}>Experience</div><div style={s.thin} />
        {data.experience.map((exp, i) => !exp.company && !exp.jobTitle ? null : (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={s.row}><span style={s.bold}>{exp.jobTitle}</span><span style={s.date}>{period(exp)}</span></div>
            <div style={s.sub}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
            {exp.description && <div style={s.desc}>{exp.description}</div>}
          </div>
        ))}</>
      )}

      {data.education.some(e => e.institution || e.degree) && (
        <><div style={s.sec}>Education</div><div style={s.thin} />
        {data.education.map((edu, i) => !edu.institution && !edu.degree ? null : (
          <div key={i} style={{ ...s.row, marginBottom: 8 }}>
            <div><span style={s.bold}>{edu.degree}</span><div style={s.sub}>{edu.institution}{edu.location ? ` · ${edu.location}` : ""}{edu.grade ? ` · ${edu.grade}` : ""}</div></div>
            <span style={s.date}>{edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ""}</span>
          </div>
        ))}</>
      )}

      {data.certifications && data.certifications.some(c => c.name) && (
        <><div style={s.sec}>Certifications</div><div style={s.thin} />
        <div style={{ display: "flex", flexWrap: "wrap" as const }}>
          {data.certifications.map((c, i) => !c.name ? null : (
            <div key={i} style={s.pill}>{c.name}{c.issuer ? ` · ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}</div>
          ))}
        </div></>
      )}

      {data.keyStrengths && data.keyStrengths.length > 0 && (
        <><div style={s.sec}>Key Strengths</div><div style={s.thin} />
        <div style={s.grid2}>{data.keyStrengths.map((k, i) => <div key={i} style={s.bullet}>• {k}</div>)}</div></>
      )}
    </div>
  );
}

// ─── MODERN ───────────────────────────────────────────────────────────────────

export function ModernTemplate({ data }: { data: ResumeFormData }) {
  const s: Record<string, React.CSSProperties> = {
    root: { fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 10.5, color: "#222", background: "#fff" },
    header: { background: "#0f172a", color: "#fff", padding: "24px 32px 20px" },
    name: { fontSize: 24, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" as const },
    role: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
    contactBar: { display: "flex", flexWrap: "wrap" as const, gap: "8px 16px", marginTop: 8, fontSize: 9.5, color: "#cbd5e1" },
    body: { padding: "16px 32px" },
    sec: { fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, color: "#0ea5e9", marginTop: 12, marginBottom: 4 },
    rule: { borderTop: "1px solid #e2e8f0", marginBottom: 6 },
    row: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 },
    bold: { fontWeight: 700, fontSize: 10.5 },
    sub: { fontSize: 9.5, color: "#64748b" },
    date: { fontSize: 9.5, color: "#94a3b8", whiteSpace: "nowrap" as const },
    desc: { fontSize: 10, color: "#374151", marginTop: 3, whiteSpace: "pre-wrap" as const },
    pill: { display: "inline-block", background: "#f1f5f9", borderRadius: 4, padding: "2px 7px", fontSize: 9.5, marginRight: 4, marginBottom: 3, color: "#334155" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 20px", fontSize: 10, color: "#374151" },
  };

  return (
    <div style={s.root} id="resume-preview">
      <div style={s.header}>
        <div style={s.name}>{data.fullName || "Your Name"}</div>
        {data.targetRole && <div style={s.role}>{data.targetRole}</div>}
        <div style={s.contactBar}>
          {[data.email, data.phone, data.location, data.linkedin].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      <div style={s.body}>
        {data.summary && <><div style={s.sec}>Summary</div><div style={s.rule} /><p style={{ fontSize: 10.5, color: "#374151", lineHeight: 1.7, marginBottom: 4 }}>{data.summary}</p></>}

        {data.skills.length > 0 && (
          <><div style={s.sec}>Skills</div><div style={s.rule} />
          <div>{data.skills.map((sk, i) => <span key={i} style={s.pill}>{sk}</span>)}</div></>
        )}

        {data.experience.some(e => e.company || e.jobTitle) && (
          <><div style={s.sec}>Experience</div><div style={s.rule} />
          {data.experience.map((exp, i) => !exp.company && !exp.jobTitle ? null : (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={s.row}><span style={s.bold}>{exp.jobTitle}</span><span style={s.date}>{period(exp)}</span></div>
              <div style={s.sub}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
              {exp.description && <div style={s.desc}>{exp.description}</div>}
            </div>
          ))}</>
        )}

        {data.education.some(e => e.institution || e.degree) && (
          <><div style={s.sec}>Education</div><div style={s.rule} />
          {data.education.map((edu, i) => !edu.institution && !edu.degree ? null : (
            <div key={i} style={{ ...s.row, marginBottom: 8 }}>
              <div><span style={s.bold}>{edu.degree}</span><div style={s.sub}>{edu.institution}{edu.location ? ` · ${edu.location}` : ""}{edu.grade ? ` · ${edu.grade}` : ""}</div></div>
              <span style={s.date}>{edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ""}</span>
            </div>
          ))}</>
        )}

        {data.certifications && data.certifications.some(c => c.name) && (
          <><div style={s.sec}>Certifications</div><div style={s.rule} />
          <div>{data.certifications.map((c, i) => !c.name ? null : (
            <span key={i} style={{ ...s.pill, background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" }}>
              {c.name}{c.issuer ? ` · ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}
            </span>
          ))}</div></>
        )}

        {data.keyStrengths && data.keyStrengths.length > 0 && (
          <><div style={s.sec}>Key Strengths</div><div style={s.rule} />
          <div style={s.grid2}>{data.keyStrengths.map((k, i) => <div key={i}>• {k}</div>)}</div></>
        )}
      </div>
    </div>
  );
}

// ─── MINIMAL ──────────────────────────────────────────────────────────────────

export function MinimalTemplate({ data }: { data: ResumeFormData }) {
  const s: Record<string, React.CSSProperties> = {
    root: { fontFamily: "'Inter','Segoe UI',sans-serif", fontSize: 10.5, color: "#111", background: "#fff", padding: "40px 48px", lineHeight: 1.65 },
    name: { fontSize: 20, fontWeight: 300, letterSpacing: 4, textTransform: "uppercase" as const, marginBottom: 4 },
    role: { fontSize: 10.5, color: "#6b7280", marginBottom: 6 },
    contact: { fontSize: 9.5, color: "#999", display: "flex", gap: 14, flexWrap: "wrap" as const, marginBottom: 24 },
    sec: { fontSize: 8.5, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase" as const, color: "#10b981", marginTop: 16, marginBottom: 3 },
    rule: { borderTop: "0.5px solid #e5e7eb", marginBottom: 8 },
    row: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 },
    bold: { fontWeight: 600, fontSize: 10.5 },
    sub: { fontSize: 9.5, color: "#6b7280" },
    date: { fontSize: 9.5, color: "#9ca3af", whiteSpace: "nowrap" as const },
    desc: { fontSize: 10, color: "#374151", marginTop: 3, whiteSpace: "pre-wrap" as const },
    skillsWrap: { display: "flex", flexWrap: "wrap" as const, gap: "3px 14px", fontSize: 10, color: "#374151" },
    certItem: { fontSize: 10, color: "#374151", marginBottom: 3 },
  };

  return (
    <div style={s.root} id="resume-preview">
      <div style={s.name}>{data.fullName || "Your Name"}</div>
      {data.targetRole && <div style={s.role}>{data.targetRole}</div>}
      <div style={s.contact}>
        {[data.email, data.phone, data.location, data.linkedin, data.website].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
      </div>

      {data.summary && <><div style={s.sec}>Profile</div><div style={s.rule} /><p style={{ fontSize: 10.5, color: "#374151", lineHeight: 1.75, marginBottom: 4 }}>{data.summary}</p></>}

      {data.skills.length > 0 && (
        <><div style={s.sec}>Skills</div><div style={s.rule} />
        <div style={s.skillsWrap}>{data.skills.map((sk, i) => <span key={i}>{sk}</span>)}</div></>
      )}

      {data.experience.some(e => e.company || e.jobTitle) && (
        <><div style={s.sec}>Experience</div><div style={s.rule} />
        {data.experience.map((exp, i) => !exp.company && !exp.jobTitle ? null : (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={s.row}><span style={s.bold}>{exp.jobTitle}</span><span style={s.date}>{period(exp)}</span></div>
            <div style={s.sub}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
            {exp.description && <div style={s.desc}>{exp.description}</div>}
          </div>
        ))}</>
      )}

      {data.education.some(e => e.institution || e.degree) && (
        <><div style={s.sec}>Education</div><div style={s.rule} />
        {data.education.map((edu, i) => !edu.institution && !edu.degree ? null : (
          <div key={i} style={{ ...s.row, marginBottom: 8 }}>
            <div><span style={s.bold}>{edu.degree}</span><div style={s.sub}>{edu.institution}{edu.location ? ` · ${edu.location}` : ""}{edu.grade ? ` · ${edu.grade}` : ""}</div></div>
            <span style={s.date}>{edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ""}</span>
          </div>
        ))}</>
      )}

      {data.certifications && data.certifications.some(c => c.name) && (
        <><div style={s.sec}>Certifications</div><div style={s.rule} />
        {data.certifications.map((c, i) => !c.name ? null : (
          <div key={i} style={s.certItem}>{c.name}{c.issuer ? <span style={{ color: "#9ca3af" }}> · {c.issuer}</span> : ""}{c.year ? <span style={{ color: "#9ca3af" }}> ({c.year})</span> : ""}</div>
        ))}</>
      )}

      {data.keyStrengths && data.keyStrengths.length > 0 && (
        <><div style={s.sec}>Key Strengths</div><div style={s.rule} />
        <div style={s.skillsWrap}>{data.keyStrengths.map((k, i) => <span key={i}>• {k}</span>)}</div></>
      )}
    </div>
  );
}
