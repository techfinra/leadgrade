export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // 쿼리스트링 그대로 전달 (ServiceKey 포함)
  const qs = new URLSearchParams(req.query);
  const ep = qs.get('_ep') || 'getScsbidListSttusServc';
  const svc = qs.get('_svc') || 'ScsbidInfoService';
  qs.delete('_ep');
  qs.delete('_svc');

  const target = `https://apis.data.go.kr/1230000/as/${svc}/${ep}?${qs.toString()}`;

  try {
    const r = await fetch(target, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadGrade/1.0)' },
      signal: AbortSignal.timeout(15000)
    });
    const text = await r.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(text);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
