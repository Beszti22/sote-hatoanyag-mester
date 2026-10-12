import fs from 'fs';

const drugs = JSON.parse(fs.readFileSync('supabase/seed/drugs-seed.json', 'utf-8'));

function esc(val) {
  if (val === null || val === undefined) return 'null';
  return `'${String(val).replace(/'/g, "''")}'`;
}

const rows = drugs.map(d =>
  `(${esc(d.id)}, ${esc(d.category)}, ${esc(d.name)}, ${esc(d.mechanism)}, ${esc(d.side_effects)}, ${esc(d.indication)}, ${d.is_free}, ${d.sort_order})`
).join(',\n');

const sql = `-- Auto-generated from supabase/seed/drugs-seed.json — do not hand-edit, regenerate instead.
insert into public.drugs (id, category, name, mechanism, side_effects, indication, is_free, sort_order)
values
${rows}
on conflict (id) do update set
  category = excluded.category,
  name = excluded.name,
  mechanism = excluded.mechanism,
  side_effects = excluded.side_effects,
  indication = excluded.indication,
  is_free = excluded.is_free,
  sort_order = excluded.sort_order;
`;

fs.writeFileSync('supabase/migrations/0002_seed_drugs.sql', sql, 'utf-8');
console.log('Wrote supabase/migrations/0002_seed_drugs.sql —', drugs.length, 'rows');
