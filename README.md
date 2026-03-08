# 🎓 고등교육기관 취업통계 대시보드 (Employment Rates App)

최신 취업 시장 동향과 KOSIS(국가통계포털) 실시간 고용률 데이터를 시각화한 모던 인터랙티브 대시보드입니다.

## ✨ 주요 기능
- **실시간 데이터 연동**: KOSIS Open API를 활용하여 매월 발표되는 국가 전체 고용률(%)의 최근 6개월 추이를 실시간으로 가져옵니다.
- **다차원 데이터 시각화**: Recharts를 활용하여 교육부/KEDI 기반의 계열별(의약, 교육, 공학 등) 취업률 및 5년 변동 트렌드를 인터랙티브 라인/바/파이 차트로 제공합니다.
- **초봉 및 직무 딥다이브**: 계열별 유망 직무와 대체/소멸 위험 직무(비추천), 예측 초봉 범위를 모달(Modal) 뷰를 통해 직관적으로 확인할 수 있습니다.
- **사용자 편의성(UX)**: 다양한 필터(정렬/검색) 및 클릭 가능한 요약 위젯, Glassmorphism 기반의 아름다운 다크 테마 UI를 제공합니다.

## 🛠 기술 스택
- **Core**: React 18, Vite
- **Styling**: Vanilla CSS (Glassmorphism, CSS Variables, Flex/Grid Layout)
- **Data Visualization**: Recharts
- **Icons**: Lucide-React
- **API/Network**: Web Fetch API (KOSIS Open API 연동)

## 🚀 로컬 실행 방법
1. 저장소 클론 및 패키지 설치
    ```bash
    npm install
    ```
2. 개발 서버 실행
    ```bash
    npm run dev
    ```
    (브라우저에서 `http://localhost:5173` 등 주어진 로컬 포트로 접속합니다.)
3. 프로덕션 빌드
    ```bash
    npm run build
    ```

## ⚠️ KOSIS API 관련 (선택 사항)
본 프로젝트는 KOSIS에서 제공하는 실시간 고용 동향 지표를 연동하고 있습니다.
CORS 제약을 피하기 위해 `vite.config.js` 상에 `/api/kosis` 경로로 프록시(Proxy)가 설정되어 있습니다. 추후 실제 서비스 배포 시, Vercel/Netlify 등의 서버리스 함수나 Nginx 프록시 설정, 혹은 백엔드 서버를 통한 API 우회 호출 구성이 필요합니다.

---
*통계 출처: 교육부 (2025년 기준) / 전망 출처: 한국고용정보원 2024-2034 전망*
