# OpenCode 에이전트 아키텍처

## 에이전트 정보 흐름

```
[1] 유저 입력
    cli/cmd/tui/component/prompt/index.tsx
    submit() → sdk.client.session.prompt()

[2] 서버 라우트
    server/instance/session.ts
    POST /:sessionID/message
    → SessionPrompt.Service.prompt()

[3] 세션 루프
    session/prompt.ts
    prompt() → loop() → runLoop()
    - 어시스턴트 메시지 생성
    - 에이전트/모델 결정

[4] LLM 호출
    session/llm.ts
    LLM.stream() → streamText() (AI SDK)
    → 스트림 시작

[5] 스트림 이벤트 처리
    session/processor.ts
    SessionProcessor
    - text-delta → TextPart 저장
    - tool-call  → 도구 실행
    - finish     → 루프 종료 판단

[6] 이벤트 발행
    bus/index.ts
    Bus.publish()
    → Session.Event.Message.Updated
    → Session.Event.Message.Part.Updated

[7] TUI 구독
    cli/cmd/tui/context/sync.tsx
    useSync() → setStore() 상태 업데이트

[8] 렌더링
    cli/cmd/tui/routes/session/index.tsx
    createMemo() → 화면 업데이트
```

## 핵심 파일

| 역할 | 파일 | 주요 함수 |
|------|------|----------|
| TUI 프롬프트 | `cli/cmd/tui/component/prompt/index.tsx` | `submit()` (591줄) |
| 서버 라우트 | `server/instance/session.ts` | POST 854줄 |
| 세션 프롬프트 | `session/prompt.ts` | `SessionPrompt.prompt()` (1286줄) |
| 메인 루프 | `session/prompt.ts` | `runLoop()` (1315줄) |
| LLM 스트리밍 | `session/llm.ts` | `LLM.stream()` (55줄) |
| 이벤트 처리 | `session/processor.ts` | `SessionProcessor.create()` (109줄) |
| 이벤트 버스 | `bus/index.ts` | `Bus.publish()` (84줄) |
| TUI 이벤트 구독 | `cli/cmd/tui/context/event.ts` | `useEvent()` |
| TUI 상태 동기화 | `cli/cmd/tui/context/sync.tsx` | `useSync()` |
| 화면 렌더링 | `cli/cmd/tui/routes/session/index.tsx` | 메시지 UI |

## 주요 데이터 구조

- **MessageV2** — 메시지 모델 (User / Assistant)
- **MessageV2.Part** — 메시지 파트 (Text, Tool, File, Reasoning 등)
- **Bus.Event** — PubSub 이벤트 발행/구독
- **Session** — 세션 정보 (DB 저장)
- **SessionStatus** — 세션 상태 (busy / idle)

## 캐릭터 트리거 훅 포인트

트리거를 연결하기 좋은 위치:

- **[5] → [6] 사이** — `session/processor.ts`에서 스트림 이벤트를 받은 직후,
  `Bus.publish()` 전에 커스텀 이벤트를 끼워넣을 수 있음
- **[6] Bus** — 커스텀 이벤트 타입을 추가해서 TUI 또는 Tauri 창에서 구독

## 실행

```bash
# 루트에서
bun install
bun run dev
```

Nix 환경이면 먼저 `nix develop` 후 위 명령 실행.
