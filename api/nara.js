export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const qs = new URLSearchParams(req.query);
  const ep  = qs.get('_ep')  || 'getScsbidListSttusServc';
  const svc = qs.get('_svc') || 'ScsbidInfoService';
  qs.delete('_ep');
  qs.delete('_svc');

  const target = `https://apis.data.go.kr/1230000/as/${svc}/${ep}?${qs.toString()}`;

  try {
    const r = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LeadGrade/1.0)',
        'Accept': 'application/json, text/xml, */*'
      }
    });
    const text = await r.text();
    // 디버그: 응답 정보 포함
    if (!text || text.length < 50) {
      res.status(200).json({
        _debug: true,
        _status: r.status,
        _statusText: r.statusText,
        _target: target.replace(qs.get('ServiceKey') || '', '***'),
        _body: text,
        _bodyLen: text.length
      });
      return;
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(text);
  } catch (e) {
    res.status(200).json({ _error: e.message, _target: target.slice(0,100) });
  }
}
