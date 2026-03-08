import React, { useState, useEffect } from 'react';
import { Activity, Loader2, RefreshCw } from 'lucide-react';

const KosisWidget = () => {
  const apiKey = 'ZDJlYmQ4YjIwNzlhMTU4ZWE3NmE5NzkyN2M5ZDEzNjI='; // Hardcoded as per user request
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchKosisData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 101: 통계청, DT_1DA7001S: 경제활동인구총괄 (월간 고용률) (T90)
      // KOSIS API 요청 형태 (CORS 우회를 위해 Vite proxy(/api/kosis) 사용)
      const url = `/api/kosis/openapi/Param/statisticsParameterData.do?method=getList&orgId=101&tblId=DT_1DA7001S&objL1=0+&objL2=&objL3=&objL4=&objL5=&objL6=&objL7=&objL8=&itmId=T90+&prdSe=M&newEstPrdCnt=6&format=json&jsonVD=Y&apiKey=${apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`데이터를 불러오는데 실패했습니다. (HTTP ${response.status})`);
      }
      
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch(e) {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }
      
      if (result.err) {
        throw new Error(result.errMsg || 'API 호출 오류 발생');
      }
      
      // 데이터 변환 (최근 6개월 등 표시)
      // KOSIS 최신 API는 DT가 실제 값입니다.
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKosisData();
  }, []);

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Activity size={20} style={{ color: 'var(--accent-color)' }} />
          국가 전체 고용률 실시간 연동 (KOSIS)
        </h3>
        
        <button 
          onClick={fetchKosisData}
          disabled={loading}
          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '8px 12px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', transition: 'all 0.2s' }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          새로고침
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#fda4af', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
          오류: {error}
        </div>
      )}

      {data && Array.isArray(data) && data.length > 0 && (
        <div style={{ marginTop: '8px', overflowX: 'auto' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem' }}>
            최근 업데이트된 월간 전체 고용률 지표 (단위: %)
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {data.slice(-6).map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', flex: '1', minWidth: '100px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                  {item.PRD_DE.substring(0, 4)}년 {item.PRD_DE.substring(4)}월
                </div>
                <div style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 'bold' }}>
                  {item.DT}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KosisWidget;
