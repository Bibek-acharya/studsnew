"use client";

/**
 * The admin coin console.
 *
 * One client component covering 04 §6's four monitoring and editing surfaces:
 *
 *   - the health dashboard (05 §5)
 *   - the economy config editor, with the version history beside it
 *   - the support view — "why does this student have 30 coins"
 *   - the signed correction form
 *
 * ## Why this whole page is a client component
 *
 * Every endpoint here is behind `RequireRole("superadmin", "super_admin")` and
 * authenticates from `localStorage["superadmin_token"]`. That token does not exist on
 * the server, so a Server Component cannot read any of this data. Splitting it into
 * four client islands would buy nothing — there would be one bundle either way — so
 * this is one component with four tabs rather than four routes.
 *
 * Tabs rather than four pages because the surfaces are used TOGETHER: an operator
 * investigating "this student's balance looks wrong" wants the support view and the
 * config in the same session, and a correction is almost always preceded by reading
 * the journal that prompted it.
 */

import { useCallback, useEffect, useState } from "react";
import {
  adminCoinsApi,
  adjustmentReasons,
  diffConfigVersions,
  summariseHealth,
  type AdminConfigVersion,
  type AdminEconomyConfig,
  type AdminHealth,
  type AdminSupportView,
} from "@/services/adminCoinsApi";

type Tab = "health" | "config" | "support" | "adjust";

const TABS: { id: Tab; label: string }[] = [
  { id: "health", label: "Health" },
  { id: "config", label: "Economy config" },
  { id: "support", label: "Support view" },
  { id: "adjust", label: "Correct a balance" },
];

export default function AdminCoinsConsole() {
  const [tab, setTab] = useState<Tab>("health");

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-900">StudsToken console</h1>
      <p className="mt-1 text-sm text-gray-600">
        Monitoring and configuration for the coin economy. Prices, earn rates and gates
        all take effect for new activity only — coins already spent stay spent.
      </p>

      {/* A tablist with real ARIA roles, because this is a keyboard-navigable set of
          panels rather than four styled buttons. Arrow-key navigation is left to the
          browser's default tab behaviour, which is adequate for four tabs and avoids
          hand-rolling roving focus. */}
      <div role="tablist" aria-label="Coin console sections" className="mt-6 flex flex-wrap gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            aria-controls={`coin-panel-${t.id}`}
            id={`coin-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "border-b-2 border-blue-700 px-4 py-2 text-sm font-medium text-blue-800"
                : "border-b-2 border-transparent px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`coin-panel-${tab}`}
        aria-labelledby={`coin-tab-${tab}`}
        className="mt-6"
      >
        {tab === "health" ? <HealthPanel /> : null}
        {tab === "config" ? <ConfigPanel /> : null}
        {tab === "support" ? <SupportPanel /> : null}
        {tab === "adjust" ? <AdjustPanel /> : null}
      </div>
    </div>
  );
}

// ─── health ───────────────────────────────────────────────────────────────────

function HealthPanel() {
  const [days, setDays] = useState(30);
  const [health, setHealth] = useState<AdminHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Every setState in here happens AFTER an await. Setting `loading` synchronously at
  // the top would be the cascading render the react-hooks/set-state-in-effect rule is
  // about, so the flag is raised by whoever CHANGES the window instead — there is no
  // other caller.
  const load = useCallback(async () => {
    try {
      setHealth(await adminCoinsApi.getHealth(days));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read the economy health.");
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }, [days]);

  // `load` sets every piece of state after an `await`, so nothing is set
  // synchronously and there is no cascading render. Disabled rather than worked around
  // because both alternatives are wrong here: Suspense plus `use()` needs the fetch
  // deduplicated and the data present during the server render, and this data is not —
  // the superadmin token lives in localStorage, so only the browser can fetch it.
  // Hoisting the call to a click handler would leave the panel empty until an operator
  // presses a button that is not obviously a load button.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    void load();
  }, [load]);

  const verdict = summariseHealth(health);

  return (
    <section aria-labelledby="health-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="health-heading" className="text-lg font-semibold text-gray-900">
          Economy health
        </h2>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Window
          <select
            value={days}
            onChange={(e) => {
              setDays(Number(e.target.value));
              setLoading(true);
            }}
            className="rounded border border-gray-300 px-2 py-1"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </label>
      </div>

      {loading ? <p className="mt-4 text-gray-500">Loading…</p> : null}
      {error ? (
        <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-900">
          {error}
        </p>
      ) : null}

      {health && !loading ? (
        <>
          <VerdictBanner verdict={verdict} />

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Metric
              label="Coins issued"
              value={health.summary.coins_issued.toLocaleString()}
            />
            <Metric label="Coins spent" value={health.summary.coins_spent.toLocaleString()} />
            <Metric label="Coins expired" value={health.summary.coins_expired.toLocaleString()} />
            <Metric
              label="Faucet : sink"
              value={formatRatio(health.summary.faucet_sink_ratio, health.summary.faucet_sink_ratio_defined)}
            />
            <Metric
              label="Velocity"
              value={formatRatio(health.summary.velocity, health.summary.velocity_defined)}
            />
            <Metric
              label="Days of currency on hand"
              value={formatRatio(
                health.summary.days_of_currency_on_hand,
                health.summary.days_of_currency_on_hand_defined,
                1,
              )}
            />
            <Metric
              label="Referral share of issuance"
              value={formatRatio(
                health.summary.referral_share,
                health.summary.referral_share_defined,
                3,
              )}
            />
            <Metric
              label="Days over the fraud target"
              value={`${health.summary.days_above_target} of ${health.summary.days_defined}`}
            />
            <Metric label="Metric version" value={String(health.metric_version)} />
          </dl>

          {health.days.length > 0 ? <HealthTable days={health.days} /> : (
            <p className="mt-6 text-gray-600">
              No days have been rolled up in this window yet. The rollup runs shortly after
              midnight UTC.
            </p>
          )}
        </>
      ) : null}
    </section>
  );
}

/**
 * The verdict banner.
 *
 * Three visually distinct states, and `unknown` is styled as NEUTRAL rather than as a
 * pass — a fresh deployment has no rollup rows at all, and an operator who learns to
 * read this banner as reassurance will skim the first real breach.
 */
function VerdictBanner({ verdict }: { verdict: ReturnType<typeof summariseHealth> }) {
  const tone =
    verdict.status === "action"
      ? "border-red-300 bg-red-50 text-red-900"
      : verdict.status === "ok"
        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
        : "border-gray-300 bg-gray-50 text-gray-800";

  const heading =
    verdict.status === "action" ? "Needs attention" : verdict.status === "ok" ? "In band" : "Not measurable yet";

  return (
    <div role="status" className={`mt-4 rounded-md border p-4 ${tone}`}>
      <h3 className="font-semibold">{heading}</h3>
      <ul className="mt-1 list-inside list-disc text-sm">
        {verdict.reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A ratio, or an honest blank.
 *
 * "—" rather than 0 for an undefined ratio: a zero faucet:sink reads as deflation and
 * a zero velocity as "nothing circulates", both alarming and both false on a day with
 * no activity.
 */
function formatRatio(value: number, defined: boolean, digits = 2): string {
  if (!defined) return "—";
  return value.toFixed(digits);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-200 p-3">
      <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function HealthTable({ days }: { days: AdminHealth["days"] }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">Daily economy figures, oldest first.</caption>
        <thead>
          <tr className="border-b border-gray-200">
            <th scope="col" className="py-2 pr-3 font-medium text-gray-700">Day (UTC)</th>
            <th scope="col" className="py-2 pr-3 font-medium text-gray-700">Issued</th>
            <th scope="col" className="py-2 pr-3 font-medium text-gray-700">Spent</th>
            <th scope="col" className="py-2 pr-3 font-medium text-gray-700">Expired</th>
            <th scope="col" className="py-2 pr-3 font-medium text-gray-700">Faucet : sink</th>
            <th scope="col" className="py-2 pr-3 font-medium text-gray-700">Referral share</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d.day} className="border-b border-gray-100">
              <th scope="row" className="py-2 pr-3 font-normal text-gray-900">{d.day.slice(0, 10)}</th>
              <td className="py-2 pr-3">{d.coins_issued}</td>
              <td className="py-2 pr-3">{d.coins_spent}</td>
              <td className="py-2 pr-3">{d.coins_expired}</td>
              <td className="py-2 pr-3">{formatRatio(d.faucet_sink_ratio, d.faucet_sink_ratio_defined)}</td>
              <td
                className={`py-2 pr-3 ${
                  d.referral_share_of_issuance_defined && !d.referral_share_healthy
                    ? "font-semibold text-red-700"
                    : ""
                }`}
              >
                {formatRatio(d.referral_share_of_issuance, d.referral_share_of_issuance_defined, 3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── config ───────────────────────────────────────────────────────────────────

function ConfigPanel() {
  const [config, setConfig] = useState<AdminEconomyConfig | null>(null);
  const [draft, setDraft] = useState<AdminEconomyConfig | null>(null);
  const [versions, setVersions] = useState<AdminConfigVersion[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const [cfg, hist] = await Promise.all([
        adminCoinsApi.getEconomyConfig(),
        adminCoinsApi.getConfigHistory(20),
      ]);
      setConfig(cfg);
      setDraft(structuredClone(cfg));
      setVersions(hist ?? []);
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Could not read the config." });
    }
  }, []);

  // `load` sets every piece of state after an `await`, so nothing is set
  // synchronously and there is no cascading render. Disabled rather than worked around
  // because both alternatives are wrong here: Suspense plus `use()` needs the fetch
  // deduplicated and the data present during the server render, and this data is not —
  // the superadmin token lives in localStorage, so only the browser can fetch it.
  // Hoisting the call to a click handler would leave the panel empty until an operator
  // presses a button that is not obviously a load button.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    void load();
  }, [load]);

  async function save() {
    if (!draft) return;
    setSaving(true);
    setMessage(null);
    try {
      // The WHOLE object, not a diff. The merge base is the stored config and a merge
      // never shrinks the set of validation violations, so while the stored config is
      // non-compliant every write is refused until one request carries compliant
      // figures. That forcing function is deliberate; sending a diff would just fail.
      const saved = await adminCoinsApi.updateEconomyConfig(draft);
      setConfig(saved);
      setDraft(structuredClone(saved));
      setMessage({ tone: "ok", text: "Saved. The change is recorded in the version history." });
      setVersions((await adminCoinsApi.getConfigHistory(20)) ?? []);
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "The save was refused." });
    } finally {
      setSaving(false);
    }
  }

  if (!draft || !config) {
    return <p className="text-gray-500">{message?.text ?? "Loading the config…"}</p>;
  }

  const pending = diffConfigVersions(config, draft);

  return (
    <section aria-labelledby="config-heading" className="space-y-6">
      <h2 id="config-heading" className="text-lg font-semibold text-gray-900">
        Economy config
      </h2>

      {pending.length > 0 ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900">
          <h3 className="text-sm font-semibold">
            {pending.length} unsaved change{pending.length === 1 ? "" : "s"}
          </h3>
          <ul className="mt-1 list-inside list-disc text-sm">
            {pending.map((c) => (
              <li key={c.path}>
                <code>{c.path}</code>: {String(c.before)} → <strong>{String(c.after)}</strong>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <fieldset className="rounded-md border border-gray-200 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-900">Prices</legend>
        {(["study_resource", "video", "mock_test"] as const).map((k) => (
          <NumberField
            key={k}
            label={k.replace("_", " ")}
            value={draft.prices[k]}
            onChange={(v) => setDraft({ ...draft, prices: { ...draft.prices, [k]: v } })}
          />
        ))}
      </fieldset>

      <fieldset className="rounded-md border border-gray-200 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-900">Earn rates</legend>
        {(Object.keys(draft.awards) as (keyof AdminEconomyConfig["awards"])[]).map((k) => (
          <NumberField
            key={k}
            label={k.replace(/_/g, " ")}
            value={draft.awards[k]}
            onChange={(v) => setDraft({ ...draft, awards: { ...draft.awards, [k]: v } })}
          />
        ))}
      </fieldset>

      <fieldset className="rounded-md border border-gray-200 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-900">Expiry</legend>
        {(Object.keys(draft.expiry) as (keyof AdminEconomyConfig["expiry"])[]).map((k) => (
          <NumberField
            key={k}
            label={k.replace(/_/g, " ")}
            value={draft.expiry[k]}
            onChange={(v) => setDraft({ ...draft, expiry: { ...draft.expiry, [k]: v } })}
          />
        ))}
      </fieldset>

      {/*
        The gates, given their own fieldset and a warning, because flipping one is the
        single most consequential edit on this page: it starts charging students for
        something they have had at no charge. Turning the document gate on ALSO needs
        `unlock_endpoint_enabled`, or the site would charge at the download while the
        unlock endpoint refuses — two prices for one document.
      */}
      <fieldset className="rounded-md border-2 border-amber-300 bg-amber-50/40 p-4">
        <legend className="px-1 text-sm font-semibold text-amber-900">
          Charge gates — these start charging students
        </legend>
        <p className="text-sm text-amber-900">
          Every gate ships off. Turning one on makes the published price real. This is not
          undone by turning it off: a student who already paid keeps the unlock.
        </p>
        <div className="mt-3 space-y-2">
          {(["study_resource", "video", "mock_test"] as const).map((k) => (
            <ToggleField
              key={k}
              label={k.replace("_", " ")}
              checked={draft.gates_enabled[k]}
              onChange={(v) => setDraft({ ...draft, gates_enabled: { ...draft.gates_enabled, [k]: v } })}
            />
          ))}
          <ToggleField
            label="unlock endpoint enabled (required alongside the document gate)"
            checked={draft.unlock_endpoint_enabled}
            onChange={(v) => setDraft({ ...draft, unlock_endpoint_enabled: v })}
          />
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || pending.length === 0}
          className="rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save config"}
        </button>
        <button
          type="button"
          onClick={() => setDraft(structuredClone(config))}
          disabled={saving || pending.length === 0}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
        >
          Discard changes
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className={`rounded-md border p-3 text-sm ${
            message.tone === "ok"
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-red-300 bg-red-50 text-red-900"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <VersionHistory versions={versions} current={config} />
    </section>
  );
}

/**
 * The version history, newest first, each entry showing only what CHANGED.
 *
 * A full before/after dump would be forty fields per row and unreadable; a leaf diff
 * is the thing an operator is actually looking for when they open an audit trail.
 */
function VersionHistory({
  versions,
  current,
}: {
  versions: AdminConfigVersion[];
  current: AdminEconomyConfig;
}) {
  if (versions.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Version history</h3>
        <p className="text-sm text-gray-600">No config change has been recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-gray-900">
        Version history (newest first)
      </h3>
      <ol className="mt-2 space-y-2">
        {versions.map((v) => {
          const changes = v.previous ? diffConfigVersions(v.previous, v.new ?? v.previous) : [];
          return (
            <li key={v.id} className="rounded-md border border-gray-200 p-3 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-medium text-gray-900">{v.changed_by || `user ${v.changed_by_user_id}`}</span>
                <time className="text-gray-500" dateTime={v.created_at}>
                  {new Date(v.created_at).toLocaleString()}
                </time>
              </div>
              {changes.length === 0 ? (
                <p className="mt-1 text-gray-600">
                  {v.previous
                    ? "No field differences recorded."
                    : "First recorded version — nothing to compare against."}
                </p>
              ) : (
                <ul className="mt-1 list-inside list-disc text-gray-700">
                  {changes.map((c) => (
                    <li key={c.path}>
                      <code>{c.path}</code>: {String(c.before)} → <strong>{String(c.after)}</strong>
                    </li>
                  ))}
                </ul>
              )}
              {/* The newest recorded version is what the editor is showing, so a
                  mismatch between them means the config changed in another session
                  after this list was read. */}
              {v.new && JSON.stringify(v.new) === JSON.stringify(current) ? (
                <p className="mt-1 text-xs text-gray-500">Matches the config currently loaded.</p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─── support ──────────────────────────────────────────────────────────────────

function SupportPanel() {
  const [userId, setUserId] = useState("");
  const [view, setView] = useState<AdminSupportView | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    const id = Number(userId.trim());
    if (!Number.isInteger(id) || id <= 0) {
      setError("Enter a numeric user id.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setView(await adminCoinsApi.getSupportView(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that student's coins.");
      setView(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="support-heading">
      <h2 id="support-heading" className="text-lg font-semibold text-gray-900">
        Support view
      </h2>
      <p className="text-sm text-gray-600">
        Answers &quot;why does this student have N coins&quot; — cached balances beside
        balances recomputed from the journal, so drift is visible rather than explained.
      </p>

      <form
        className="mt-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void lookup();
        }}
      >
        <label className="text-sm">
          User id
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            inputMode="numeric"
            className="mt-1 block w-40 rounded border border-gray-300 px-2 py-1"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? "Looking up…" : "Look up"}
        </button>
      </form>

      {error ? (
        <p role="alert" className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-red-900">
          {error}
        </p>
      ) : null}

      {view ? <SupportViewBody view={view} /> : null}
    </section>
  );
}

function SupportViewBody({ view }: { view: AdminSupportView }) {
  const drifted = view.accounts?.filter((a) => a.drifted) ?? [];
  const lapsed = view.lots?.filter((l) => l.expired) ?? [];

  return (
    <div className="mt-6 space-y-6">
      {/* Drift first, because it is the finding. Everything else on this screen is a
          number somebody is asking about; a mismatch between the cached and computed
          balance is a bug, and it outranks the question. */}
      {drifted.length > 0 || (view.discrepancies?.length ?? 0) > 0 ? (
        <div role="alert" className="rounded-md border-2 border-red-300 bg-red-50 p-4 text-red-900">
          <h3 className="font-semibold">This student&apos;s rows do not reconcile</h3>
          <ul className="mt-1 list-inside list-disc text-sm">
            {view.discrepancies?.map((d) => <li key={d}>{d}</li>)}
            {drifted.map((a) => (
              <li key={a.account_id}>
                Account {a.account_id} ({a.bucket}): cached {a.cached_posted}, computed{" "}
                {a.computed_posted}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <dl className="grid grid-cols-3 gap-4">
        <Metric label="Posted" value={view.total_posted.toLocaleString()} />
        <Metric label="Reserved" value={view.total_reserved.toLocaleString()} />
        <Metric label="Available" value={view.total_available.toLocaleString()} />
      </dl>

      {lapsed.length > 0 ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {lapsed.length} lot{lapsed.length === 1 ? " has" : "s have"} lapsed but not yet been
          swept, so the balance still counts coins that can no longer be spent. The sweep
          runs hourly.
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-900">Accounts</h3>
        <table className="mt-2 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th scope="col" className="py-2 pr-3">Account</th>
              <th scope="col" className="py-2 pr-3">Bucket</th>
              <th scope="col" className="py-2 pr-3">Cached</th>
              <th scope="col" className="py-2 pr-3">Computed</th>
              <th scope="col" className="py-2 pr-3">Reserved</th>
            </tr>
          </thead>
          <tbody>
            {(view.accounts ?? []).map((a) => (
              <tr key={a.account_id} className="border-b border-gray-100">
                <th scope="row" className="py-2 pr-3 font-normal">
                  {a.account_id}
                  {a.closed ? <span className="ml-2 text-amber-700">(closed)</span> : null}
                </th>
                <td className="py-2 pr-3">{a.bucket}</td>
                <td className="py-2 pr-3">{a.cached_posted}</td>
                <td className={`py-2 pr-3 ${a.drifted ? "font-semibold text-red-700" : ""}`}>
                  {a.computed_posted}
                </td>
                <td className="py-2 pr-3">{a.cached_reserved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-900">
          Journal ({view.journals?.length ?? 0} entries)
        </h3>
        <table className="mt-2 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th scope="col" className="py-2 pr-3">When</th>
              <th scope="col" className="py-2 pr-3">Type</th>
              <th scope="col" className="py-2 pr-3">Reason</th>
              <th scope="col" className="py-2 pr-3 text-right">Amount</th>
              <th scope="col" className="py-2">Reference</th>
            </tr>
          </thead>
          <tbody>
            {(view.journals ?? []).map((j) => (
              <tr key={j.id} className="border-b border-gray-100">
                <td className="py-2 pr-3 text-gray-600">
                  <time dateTime={j.created_at}>{new Date(j.created_at).toLocaleString()}</time>
                </td>
                <td className="py-2 pr-3">{j.entry_type}</td>
                <td className="py-2 pr-3">{j.reason_code}</td>
                <td className={`py-2 pr-3 text-right ${j.amount < 0 ? "text-red-700" : "text-emerald-700"}`}>
                  {j.amount > 0 ? "+" : ""}
                  {j.amount}
                </td>
                <td className="py-2 text-gray-600">
                  {j.ref_type ? `${j.ref_type}#${j.ref_id}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── adjust ───────────────────────────────────────────────────────────────────

function AdjustPanel() {
  const [userId, setUserId] = useState("");
  const [direction, setDirection] = useState<"debit" | "credit">("debit");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState(adjustmentReasons[0].code);
  const [note, setNote] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Generated ONCE per mount and reused across retries of the SAME intent, which is
  // what makes it idempotent. Regenerating it on every click would turn a retry after
  // a timeout into a SECOND correction — the double-debit this whole mechanism exists
  // to prevent.
  const [idempotencyKey] = useState(
    () => `admin-corr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  );

  async function submit() {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Enter the number of coins, greater than zero.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      // Sign applied here rather than in a separate direction field: a magnitude and
      // a direction that can disagree are how a debit becomes a credit.
      const signed = direction === "debit" ? -parsed : parsed;
      const res = await adminCoinsApi.adjust({
        userId: Number(userId),
        amount: signed,
        reason,
        idempotencyKey,
        note,
      });
      setResult(
        `Journal ${res.journal_id} posted ${res.amount > 0 ? "+" : ""}${res.amount}.` +
          (res.replayed ? " This was already recorded — nothing was applied twice." : ""),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "The correction was refused.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="adjust-heading" className="max-w-2xl">
      <h2 id="adjust-heading" className="text-lg font-semibold text-gray-900">
        Correct a balance
      </h2>
      {/*
        The framing matters more than the form. 04 §4.4 forbids "set balance to N"
        because it is unreviewable and un-reversible: the ledger refuses Reverse
        outright. So this screen never offers a target balance, only a signed movement
        with a reason — and says so before the operator reaches for the field.
      */}
      <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
        <p>
          <strong>This is a movement, not a setting.</strong> There is no way to set a
          balance to a number, and a posted correction cannot be undone. Record the amount
          the balance moved, with a reason.
        </p>
      </div>

      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <label className="block text-sm">
          User id
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            inputMode="numeric"
            required
            className="mt-1 block w-40 rounded border border-gray-300 px-2 py-1"
          />
        </label>

        <fieldset>
          <legend className="text-sm">Direction</legend>
          <div className="mt-1 flex gap-4">
            {(["debit", "credit"] as const).map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="direction"
                  checked={direction === d}
                  onChange={() => setDirection(d)}
                />
                {d === "debit" ? "Take coins away (−)" : "Add coins (+)"}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm">
          Amount
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="numeric"
            required
            className="mt-1 block w-40 rounded border border-gray-300 px-2 py-1"
          />
        </label>

        <label className="block text-sm">
          Reason
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1"
          >
            {adjustmentReasons.map((r) => (
              <option key={r.code} value={r.code}>
                {r.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          Note <span className="text-gray-500">(not a reason — context for whoever reads this later)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? "Posting…" : "Post correction"}
        </button>
      </form>

      {error ? (
        <p role="alert" className="mt-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
          {error}
        </p>
      ) : null}
      {result ? (
        <p role="status" className="mt-3 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
          {result}
        </p>
      ) : null}
    </section>
  );
}

// ─── fields ───────────────────────────────────────────────────────────────────

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mt-2 flex items-center justify-between gap-4 text-sm">
      <span className="capitalize">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-32 rounded border border-gray-300 px-2 py-1"
      />
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="capitalize">{label}</span>
    </label>
  );
}