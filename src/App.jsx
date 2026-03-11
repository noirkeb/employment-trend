import React, { useState, useMemo, useEffect } from 'react';
import { Briefcase, TrendingUp, TrendingDown, Users, Award, ChevronUp, ChevronDown, Globe, Search, ArrowUpDown, PieChart as PieChartIcon, X, Activity } from 'lucide-react';
import StatCard from './components/StatCard';
import EmploymentChart from './components/EmploymentChart';
import TrendChart from './components/TrendChart';
import KeywordTags from './components/KeywordTags';
import KosisWidget from './components/KosisWidget';
import DemographicCharts from './components/DemographicCharts';
import { employmentData, summaryStats, globalTrends, genderData, universityTypeData, industryKeywords } from './data';
import './index.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('rate'); // 'rate' or 'name'
  const [selectedField, setSelectedField] = useState(null); // 모달 창에 띄울 선택된 계열 상태
  const [latestRate, setLatestRate] = useState('63.3'); // 상단 위젯용 최신 KOSIS 고용률 상태

  // 상단 위젯용 최신 고용률 간단히 가져오기
  useEffect(() => {
    const fetchLatestRate = async () => {
      try {
        const url = `/api/kosis/openapi/Param/statisticsParameterData.do?method=getList&orgId=101&tblId=DT_1DA7001S&objL1=0+&objL2=&objL3=&objL4=&objL5=&objL6=&objL7=&objL8=&itmId=T90+&prdSe=M&newEstPrdCnt=1&format=json&jsonVD=Y&apiKey=ZDJlYmQ4YjIwNzlhMTU4ZWE3NmE5NzkyN2M5ZDEzNjI=`;
        const response = await fetch(url);
        const text = await response.text();
        const result = JSON.parse(text);
        if (result && result.length > 0) {
          setLatestRate(result[0].DT);
        }
      } catch (e) {
        console.error('Failed to fetch latest global rate for widget', e);
      }
    };
    fetchLatestRate();
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedField(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // 특정 계열의 StatCard 클릭 시 모달 열기 함수
  const handleStatClick = (fieldName) => {
    const field = employmentData.find(item => item.name === fieldName);
    if (field) {
      setSelectedField(field);
    }
  };

  // 차트 전용 데이터 (취업률 오름차순으로 고정. 검색/정렬 영향 안 받음)
  const chartData = useMemo(() => {
    return [...employmentData].sort((a, b) => a.rate - b.rate);
  }, []);

  // 목록용 필터링 및 정렬 로직 적용
  const filteredAndSortedData = useMemo(() => {
    let result = employmentData.filter(item => {
      const lowSearch = searchTerm.toLowerCase();
      // 계열 이름 검색
      if (item.name?.toLowerCase().includes(lowSearch)) return true;
      
      // 하위 학과 이름 또는 직무 검색 (옵셔널 체이닝 추가)
      return item.majors?.some(major => 
        major.name?.toLowerCase().includes(lowSearch) ||
        major.jobs?.some(job => job.title?.toLowerCase().includes(lowSearch))
      );
    });

    if (sortOrder === 'rate') {
      result.sort((a, b) => (b.rate || 0) - (a.rate || 0)); // 취업률 내림차순
    } else if (sortOrder === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || '')); // 이름 가나다순
    }
    
    return result;
  }, [searchTerm, sortOrder]);

  return (
    <div className="app-wrapper">
      <header className="header">
        <h1>미래 유망 직무 및 취업 동향 대시보드</h1>
        <p>통계 출처: 교육부 (2025년 2월 최신 발표) / 전망 출처: 한국고용정보원 2024-2034 전망</p>
      </header>

      <div className="grid-stats" style={{ marginBottom: '16px' }}>
        <StatCard 
          title="전체 고용률" 
          value={`${latestRate}%`} 
          subtitle="(KOSIS 실시간)"
          icon={Activity}
          color="236, 72, 153" // pink-500
        />
        <StatCard 
          title="전체 취업률" 
          value={`${summaryStats.averageRate}%`} 
          subtitle="전년 대비 0.8%p 감소"
          icon={Users}
          color="59, 130, 246" // blue-500
        />
        <StatCard 
          title="조사 대상자 수" 
          value={summaryStats.totalSurveyed} 
          subtitle="고등교육기관 졸업자"
          icon={Briefcase}
          color="139, 92, 246" // violet-500
        />
      </div>

      <div className="grid-stats">
        <StatCard 
          title="최고 취업률"  
          value="의약계열" 
          subtitle="79.4% 기록 (상세 보기)"
          icon={Award}
          color="245, 158, 11" // amber-500
          onClick={() => handleStatClick('의약계열')}
        />
        <StatCard 
          title="유일한 상승" 
          value="교육계열" 
          subtitle="전년 대비 2.0%p 상승 (상세 보기)"
          icon={TrendingUp}
          color="16, 185, 129" // emerald-500
          onClick={() => handleStatClick('교육계열')}
        />
        <StatCard 
          title="최대 하락" 
          value="공학계열" 
          subtitle="전년 대비 -1.2%p 감소 (상세 보기)"
          icon={TrendingDown}
          color="244, 63, 94" // rose-500
          onClick={() => handleStatClick('공학계열')}
        />
      </div>

      <main className="main-content">
        <div className="glass-container chart-section">
          <h2 className="section-title">
            <Briefcase size={20} style={{ color: 'var(--accent-color)' }} />
            계열별 취업률 현황
          </h2>
          <EmploymentChart data={chartData} />
        </div>

        <div className="glass-container list-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px', gap: '16px' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              <TrendingUp size={20} style={{ color: 'var(--accent-color)' }} />
              상세 데이터 (자신의 분야 검색)
            </h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '8px 16px', minWidth: '220px' }}>
                <Search size={18} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
                <input 
                  type="text" 
                  placeholder="계열, 학과, 직무 검색..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setSortOrder('rate')}
                  style={{ padding: '8px 16px', borderRadius: '8px', background: sortOrder === 'rate' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                >
                  <ArrowUpDown size={14} /> 취업률순
                </button>
                <button 
                  onClick={() => setSortOrder('name')}
                  style={{ padding: '8px 16px', borderRadius: '8px', background: sortOrder === 'name' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                >
                  <ArrowUpDown size={14} /> 가나다순
                </button>
              </div>
            </div>
          </div>
          <div className="data-list">
            {filteredAndSortedData.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>검색 결과가 없습니다.</div>
            ) : (
              filteredAndSortedData.map((item) => {
                return (
                  <div 
                    className="data-item clickable" 
                    key={item.name} // index 대신 고유값(name) 사용
                    style={{ flexDirection: 'column', alignItems: 'stretch', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedField(item);
                      setSearchTerm(''); // 모달 진입 시 검색어 초기화 (전체 학과 표시를 위함)
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <div className="item-left">
                        <span className="item-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.name}
                        </span>
                        <span className="item-salary" style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '0.9rem' }}>초봉 예측: {item.averageSalary}</span>
                      </div>
                      <div className="item-right">
                        <span className="item-rate" style={{ color: item.color }}>{item.rate}%</span>
                        <span className={`item-trend ${item.trend?.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
                          {item.trend?.startsWith('+') ? <ChevronUp size={14} style={{display:'inline', verticalAlign:'bottom'}} /> : <ChevronDown size={14} style={{display:'inline', verticalAlign:'bottom'}} />}
                          {item.trend}
                        </span>
                      </div>
                    </div>
                    <div className="item-outlook" style={{ marginTop: '8px', paddingTop: '8px', borderTop: 'none', fontSize: '0.85rem' }}>
                       클릭하여 하위 학과별 유망 직무 확인하기
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="glass-container keyword-section" style={{ padding: '24px', gridColumn: '1 / -1', marginBottom: '24px' }}>
          <h2 className="section-title">
            <Globe size={20} style={{ color: 'var(--accent-color)' }} />
            미래 노동 시장 핵심 키워드 (WEF/KEDI 분석 기반)
          </h2>
          <KeywordTags keywords={industryKeywords} />
        </div>

        <div className="glass-container demographic-section" style={{ padding: '24px', gridColumn: '1 / -1' }}>
          <h2 className="section-title">
            <PieChartIcon size={20} style={{ color: 'var(--accent-color)' }} />
            다양한 통계 분할 (성별 및 학제별)
          </h2>
          <DemographicCharts genderData={genderData} universityTypeData={universityTypeData} />
        </div>

        <div className="glass-container global-section" style={{ padding: '24px', gridColumn: '1 / -1' }}>
          <KosisWidget />
          
          <h2 className="section-title" style={{ marginTop: '32px' }}>
            <Globe size={20} style={{ color: 'var(--accent-color)' }} />
            세계적 취업 시장 흐름 (WEF 미래 일자리 보고서 기준)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {globalTrends?.map((trend) => (
              <div key={trend.title} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)' }}>{trend.title}</h3>
                  <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', background: trend.impact?.includes('긍정적') ? 'rgba(16, 185, 129, 0.2)' : trend.impact?.includes('부정적') ? 'rgba(244, 63, 94, 0.2)' : 'rgba(139, 92, 246, 0.2)', color: trend.impact?.includes('긍정적') ? '#10b981' : trend.impact?.includes('부정적') ? '#f43f5e' : '#a78bfa' }}>
                    {trend.impact}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {trend.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div style={{ textAlign: 'center', marginTop: '40px', padding: '24px', borderTop: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '1.1rem', fontStyle: 'italic' }}>
        "미래의 노동 시장은 전공의 경계가 희미해지고, AI·디지털 역량과 인간 고유의 융복합적 협업 능력을 갖춘 인재가 주도권을 쥐게 될 것입니다."
      </div>

      {/* 모달 창 렌더링 */}
      {selectedField && (
        <div className="modal-overlay" onClick={() => setSelectedField(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: selectedField.color }}>{selectedField.name} 상세 정보</h3>
              <button className="close-btn" onClick={() => setSelectedField(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <TrendChart 
                data={selectedField.trendData} 
                color={selectedField.color} 
                title={`${selectedField.name} 5년 취업률 추이 (2020~2024)`}
              />
              

              {selectedField.majors?.map((major) => (
                <div key={major.name} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: selectedField.color, marginBottom: '12px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: selectedField.color }}></span>
                    {major.name}
                  </h4>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '6px', fontSize: '0.95rem' }}>분야 전망:</strong>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {major.outlook}
                    </p>
                  </div>

                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px', fontSize: '0.95rem' }}>대표 추천 직무:</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {major.jobs?.map((job) => (
                        <div key={job.title} style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${selectedField.color}` }}>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px', fontSize: '0.95rem' }}>{job.title}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>{job.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {major.notRecommendedJobs && major.notRecommendedJobs.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <strong style={{ display: 'flex', color: '#f43f5e', marginBottom: '8px', fontSize: '0.95rem', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', fontSize: '0.7rem', fontWeight: 'bold' }}>!</span>
                        대체/소멸 위험 직무 (비추천):
                      </strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {major.notRecommendedJobs.map((job) => (
                          <div key={job.title} style={{ background: 'rgba(244, 63, 94, 0.04)', padding: '12px', borderRadius: '8px', borderLeft: `3px solid #f43f5e` }}>
                            <div style={{ fontWeight: '600', color: '#fca5a5', marginBottom: '4px', fontSize: '0.95rem' }}>{job.title}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>{job.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
