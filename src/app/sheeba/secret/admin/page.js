"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function AdminEditor() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hero");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/data")
      .then((res) => {
        if (res.status === 401) {
          router.push("/sheeba/secret/login");
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json) setData(json);
      })
      .catch(() => setError("Failed to load data"));
  }, [router]);

  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError("Failed to save");
      }
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [data]);

  function updateField(path, value) {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = isNaN(keys[i]) ? keys[i] : parseInt(keys[i]);
        obj = obj[key];
      }
      const lastKey = isNaN(keys[keys.length - 1])
        ? keys[keys.length - 1]
        : parseInt(keys[keys.length - 1]);
      obj[lastKey] = value;
      return copy;
    });
  }

  if (!data) {
    return (
      <div style={pageStyle}>
        <p style={{ color: "#999" }}>Loading...</p>
      </div>
    );
  }

  const tabs = [
    { id: "hero", label: "Hero" },
    { id: "impact", label: "Impact" },
    { id: "timeline", label: "Timeline" },
    { id: "stories", label: "Stories" },
    { id: "skills", label: "Skills" },
    { id: "footer", label: "Footer" },
    { id: "navbar", label: "Navbar" },
    { id: "threeBackground", label: "3D Background" },
  ];

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Portfolio Editor</h1>
        <div style={headerActions}>
          {saved && <span style={savedBadge}>Saved!</span>}
          {error && <span style={errorBadge}>{error}</span>}
          <button onClick={save} disabled={saving} style={saveBtn}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div style={tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={activeTab === tab.id ? tabActive : tabInactive}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={contentArea}>
        {activeTab === "hero" && <HeroEditor data={data.hero} update={updateField} />}
        {activeTab === "impact" && <ImpactEditor data={data.impact} update={updateField} />}
        {activeTab === "timeline" && <TimelineEditor data={data.timeline} update={updateField} setData={setData} />}
        {activeTab === "stories" && <StoriesEditor data={data.stories} update={updateField} setData={setData} />}
        {activeTab === "skills" && <SkillsEditor data={data.skills} update={updateField} setData={setData} />}
        {activeTab === "footer" && <FooterEditor data={data.footer} update={updateField} />}
        {activeTab === "navbar" && <NavbarEditor data={data.navbar} update={updateField} />}
        {activeTab === "threeBackground" && <ThreeBgEditor data={data.threeBackground} update={updateField} setData={setData} />}
      </div>
    </div>
  );
}

/* ============ Section Editors ============ */

function HeroEditor({ data, update }) {
  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitle}>Hero Section</h2>
      <Field label="First Name" value={data.firstName} onChange={(v) => update("hero.firstName", v)} />
      <Field label="Last Name" value={data.lastName} onChange={(v) => update("hero.lastName", v)} />
      <Field label="Title" value={data.title} onChange={(v) => update("hero.title", v)} />
      <Field label="Tagline" value={data.tagline} onChange={(v) => update("hero.tagline", v)} textarea />
      <Field label="Image Path" value={data.image} onChange={(v) => update("hero.image", v)} />
    </div>
  );
}

function ImpactEditor({ data, update }) {
  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitle}>Impact Section</h2>
      <Field label="Heading" value={data.heading} onChange={(v) => update("impact.heading", v)} />
      <Field label="Subtitle" value={data.subtitle} onChange={(v) => update("impact.subtitle", v)} textarea />

      <h3 style={subTitle}>Metrics</h3>
      {data.metrics.map((m, i) => (
        <div key={i} style={cardStyle}>
          <Field label="Value" value={m.value} onChange={(v) => update(`impact.metrics.${i}.value`, parseInt(v) || 0)} type="number" />
          <Field label="Suffix" value={m.suffix} onChange={(v) => update(`impact.metrics.${i}.suffix`, v)} />
          <Field label="Label" value={m.label} onChange={(v) => update(`impact.metrics.${i}.label`, v)} />
          <Field label="Detail" value={m.detail} onChange={(v) => update(`impact.metrics.${i}.detail`, v)} />
        </div>
      ))}
    </div>
  );
}

function TimelineEditor({ data, update, setData }) {
  function addRole() {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.timeline.roles.push({
        period: "20XX–20XX",
        title: "New Role",
        roles: [{ role: "Title", company: "Company", initial: "C" }],
        description: "Description here",
        tags: ["Tag"],
        current: false,
      });
      return copy;
    });
  }

  function removeRole(index) {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.timeline.roles.splice(index, 1);
      return copy;
    });
  }

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitle}>Timeline Section</h2>
      <Field label="Heading" value={data.heading} onChange={(v) => update("timeline.heading", v)} />
      <Field label="Subtitle" value={data.subtitle} onChange={(v) => update("timeline.subtitle", v)} />

      <h3 style={subTitle}>Career Roles</h3>
      {data.roles.map((role, i) => (
        <div key={i} style={cardStyle}>
          <div style={cardHeader}>
            <span style={cardLabel}>Role {i + 1}</span>
            <button onClick={() => removeRole(i)} style={removeBtn}>Remove</button>
          </div>
          <Field label="Period" value={role.period} onChange={(v) => update(`timeline.roles.${i}.period`, v)} />
          <Field label="Phase Title" value={role.title} onChange={(v) => update(`timeline.roles.${i}.title`, v)} />
          <Field label="Description" value={role.description} onChange={(v) => update(`timeline.roles.${i}.description`, v)} textarea />
          <Field label="Tags (comma-separated)" value={role.tags.join(", ")} onChange={(v) => update(`timeline.roles.${i}.tags`, v.split(",").map((t) => t.trim()).filter(Boolean))} />
          <label style={checkboxLabel}>
            <input type="checkbox" checked={role.current || false} onChange={(e) => update(`timeline.roles.${i}.current`, e.target.checked)} />
            Current Role
          </label>

          <h4 style={miniTitle}>Sub-roles</h4>
          {role.roles.map((r, j) => (
            <div key={j} style={subCard}>
              <Field label="Role Title" value={r.role} onChange={(v) => update(`timeline.roles.${i}.roles.${j}.role`, v)} />
              <Field label="Company" value={r.company} onChange={(v) => update(`timeline.roles.${i}.roles.${j}.company`, v)} />
              <Field label="Initial" value={r.initial} onChange={(v) => update(`timeline.roles.${i}.roles.${j}.initial`, v)} />
            </div>
          ))}
        </div>
      ))}
      <button onClick={addRole} style={addBtn}>+ Add Role</button>
    </div>
  );
}

function StoriesEditor({ data, update, setData }) {
  function addStory() {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.stories.items.push({
        title: "New Story",
        subtitle: "Subtitle",
        challenge: "Challenge description",
        approach: ["Step 1"],
        results: [{ metric: "X%", label: "Result" }],
      });
      return copy;
    });
  }

  function removeStory(index) {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.stories.items.splice(index, 1);
      return copy;
    });
  }

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitle}>Stories Section</h2>
      <Field label="Heading" value={data.heading} onChange={(v) => update("stories.heading", v)} />

      {data.items.map((story, i) => (
        <div key={i} style={cardStyle}>
          <div style={cardHeader}>
            <span style={cardLabel}>Story {i + 1}</span>
            <button onClick={() => removeStory(i)} style={removeBtn}>Remove</button>
          </div>
          <Field label="Title" value={story.title} onChange={(v) => update(`stories.items.${i}.title`, v)} />
          <Field label="Subtitle" value={story.subtitle} onChange={(v) => update(`stories.items.${i}.subtitle`, v)} />
          <Field label="Challenge" value={story.challenge} onChange={(v) => update(`stories.items.${i}.challenge`, v)} textarea />
          <Field label="Approach (one per line)" value={story.approach.join("\n")} onChange={(v) => update(`stories.items.${i}.approach`, v.split("\n").filter(Boolean))} textarea />

          <h4 style={miniTitle}>Results</h4>
          {story.results.map((r, j) => (
            <div key={j} style={subCard}>
              <Field label="Metric" value={r.metric} onChange={(v) => update(`stories.items.${i}.results.${j}.metric`, v)} />
              <Field label="Label" value={r.label} onChange={(v) => update(`stories.items.${i}.results.${j}.label`, v)} />
            </div>
          ))}
        </div>
      ))}
      <button onClick={addStory} style={addBtn}>+ Add Story</button>
    </div>
  );
}

function SkillsEditor({ data, update, setData }) {
  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitle}>Skills Section</h2>
      <Field label="Heading" value={data.heading} onChange={(v) => update("skills.heading", v)} />

      {data.rows.map((row, i) => (
        <div key={i} style={cardStyle}>
          <span style={cardLabel}>Row {i + 1} ({row.direction.toUpperCase()})</span>
          <Field label="Direction (ltr/rtl)" value={row.direction} onChange={(v) => update(`skills.rows.${i}.direction`, v)} />
          <Field label="Duration (seconds)" value={row.duration} onChange={(v) => update(`skills.rows.${i}.duration`, parseInt(v) || 20)} type="number" />
          <Field label="Items (comma-separated)" value={row.items.join(", ")} onChange={(v) => update(`skills.rows.${i}.items`, v.split(",").map((t) => t.trim()).filter(Boolean))} textarea />
        </div>
      ))}
    </div>
  );
}

function FooterEditor({ data, update }) {
  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitle}>Footer Section</h2>
      <Field label="Marquee Text" value={data.marqueeText} onChange={(v) => update("footer.marqueeText", v)} />
      <Field label="Heading" value={data.heading} onChange={(v) => update("footer.heading", v)} />
      <Field label="Subtitle" value={data.subtitle} onChange={(v) => update("footer.subtitle", v)} />
      <Field label="CTA Text" value={data.ctaText} onChange={(v) => update("footer.ctaText", v)} />
      <Field label="Email" value={data.email} onChange={(v) => update("footer.email", v)} />
      <Field label="LinkedIn URL" value={data.linkedin} onChange={(v) => update("footer.linkedin", v)} />
      <Field label="Resume Path" value={data.resumePath} onChange={(v) => update("footer.resumePath", v)} />
      <Field label="Education" value={data.education} onChange={(v) => update("footer.education", v)} />
      <Field label="Certifications" value={data.certifications} onChange={(v) => update("footer.certifications", v)} textarea />
      <Field label="Copyright" value={data.copyright} onChange={(v) => update("footer.copyright", v)} />
    </div>
  );
}

function NavbarEditor({ data, update }) {
  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitle}>Navbar</h2>
      <Field label="Name" value={data.name} onChange={(v) => update("navbar.name", v)} />

      <h3 style={subTitle}>Navigation Links</h3>
      {data.links.map((link, i) => (
        <div key={i} style={subCard}>
          <Field label="Label" value={link.label} onChange={(v) => update(`navbar.links.${i}.label`, v)} />
          <Field label="Href" value={link.href} onChange={(v) => update(`navbar.links.${i}.href`, v)} />
        </div>
      ))}
    </div>
  );
}

function ThreeBgEditor({ data, update, setData }) {
  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitle}>3D Background</h2>
      <Field
        label="Keywords (comma-separated)"
        value={data.keywords.join(", ")}
        onChange={(v) => {
          setData((prev) => {
            const copy = JSON.parse(JSON.stringify(prev));
            copy.threeBackground.keywords = v.split(",").map((t) => t.trim()).filter(Boolean);
            return copy;
          });
        }}
        textarea
      />
    </div>
  );
}

/* ============ Reusable Field Component ============ */

function Field({ label, value, onChange, textarea, type = "text" }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div style={fieldWrapper}>
      <label style={fieldLabel}>{label}</label>
      <Tag
        type={textarea ? undefined : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={textarea ? textareaStyle : inputStyle}
        rows={textarea ? 3 : undefined}
      />
    </div>
  );
}

/* ============ Inline Styles ============ */

const pageStyle = {
  minHeight: "100vh",
  background: "#0C0C0C",
  color: "#fff",
  fontFamily: "Inter, sans-serif",
  padding: "24px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  flexWrap: "wrap",
  gap: "12px",
};

const headerActions = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const titleStyle = {
  color: "#C9A84C",
  fontSize: "28px",
  fontWeight: 700,
  margin: 0,
};

const savedBadge = {
  background: "rgba(76,175,80,0.2)",
  color: "#4CAF50",
  padding: "6px 14px",
  borderRadius: "6px",
  fontSize: "14px",
};

const errorBadge = {
  background: "rgba(255,107,107,0.2)",
  color: "#ff6b6b",
  padding: "6px 14px",
  borderRadius: "6px",
  fontSize: "14px",
};

const saveBtn = {
  background: "#C9A84C",
  color: "#0C0C0C",
  border: "none",
  borderRadius: "8px",
  padding: "12px 24px",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};

const tabBar = {
  display: "flex",
  gap: "4px",
  marginBottom: "24px",
  overflowX: "auto",
  paddingBottom: "4px",
};

const tabBase = {
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const tabActive = {
  ...tabBase,
  background: "#C9A84C",
  color: "#0C0C0C",
};

const tabInactive = {
  ...tabBase,
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.6)",
};

const contentArea = {
  maxWidth: "800px",
};

const sectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const sectionTitle = {
  color: "#C9A84C",
  fontSize: "20px",
  fontWeight: 600,
  margin: 0,
};

const subTitle = {
  color: "rgba(255,255,255,0.7)",
  fontSize: "16px",
  fontWeight: 600,
  margin: "8px 0 0",
};

const miniTitle = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "14px",
  fontWeight: 600,
  margin: "8px 0 0",
};

const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const subCard = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "8px",
  padding: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const cardLabel = {
  color: "#C9A84C",
  fontSize: "14px",
  fontWeight: 600,
};

const removeBtn = {
  background: "rgba(255,107,107,0.15)",
  color: "#ff6b6b",
  border: "1px solid rgba(255,107,107,0.3)",
  borderRadius: "6px",
  padding: "4px 12px",
  fontSize: "12px",
  cursor: "pointer",
};

const addBtn = {
  background: "rgba(201,168,76,0.15)",
  color: "#C9A84C",
  border: "1px solid rgba(201,168,76,0.3)",
  borderRadius: "8px",
  padding: "10px",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  textAlign: "center",
};

const fieldWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const fieldLabel = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "12px",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "6px",
  padding: "10px 12px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "70px",
};

const checkboxLabel = {
  color: "rgba(255,255,255,0.7)",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
};
