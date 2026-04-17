# Waifu API

## 감정 상태 (Emotion State)

아바타는 아래 감정 상태를 인풋으로 받아 해당 애니메이션을 재생합니다.

| 상태 | 설명 |
|------|------|
| `idle` | 기본 대기 상태 |
| `talk` | 말하는 중 |
| `thinking` | 생각하는 중 |
| `happy` | 기쁨 |
| `sad` | 슬픔 |
| `angry` | 화남 |
| `surprised` | 놀람 |

## 요청

```http
POST /emotion
Content-Type: application/json

{
  "emotion": "happy"
}
```

## 응답

```json
{
  "ok": true,
  "emotion": "happy"
}
```

## 에러

`emotion` 값이 목록에 없을 경우:

```json
{
  "ok": false,
  "error": "unknown emotion"
}
```

## 어댑터

렌더러는 어댑터 인터페이스를 통해 교체 가능합니다. Spine, Rive, Lottie, GIF 등 원하는 형식의 에셋을 사용할 수 있습니다.

감정 상태별로 대응하는 애니메이션/파일을 어댑터에서 매핑하면 됩니다.
