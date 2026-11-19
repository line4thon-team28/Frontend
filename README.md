# Frontend

## 포포즈 mock 프로토타입

```sh
npm ci
npm run dev -- --mode mock
```

터미널에 표시되는 로컬 주소를 열면 홈에서 실종 등록을 시작할 수 있습니다. 등록, 정보 수정, 후보 피드백, 찾음 처리 결과는 브라우저에서 화면을 이동하는 동안 공유됩니다. 새로고침하면 예시 데이터로 초기화됩니다.

| Figma | 경로 | `scenario` 값 |
| --- | --- | --- |
| 10–11 | `/lost-pets/new` | `contact`, `error` |
| 12–20 | `/candidates` | `loading`, `analyzing`, `analysis-error`, `partial`, `pending`, `feedback`, `error`, `found` |
| 27–29 | `/candidates/shelter-gangbuk` | `no-phone`, `closed` |
| 33–37 | `/my`, `/my/bori/edit` | `/my`에서 `loading`, `empty`, `error` |
| 38 | `/candidates/sighting-jeongneung` | 기본 경로 |

예를 들어 `/candidates?scenario=analysis-error`를 열면 분석 실패 상태를 볼 수 있습니다. 실제 API 연동 시 화면이 사용하는 `src/mocks/usePawPose.js`의 등록·조회·수정·피드백 인터페이스를 기준으로 데이터 소스를 교체합니다.
