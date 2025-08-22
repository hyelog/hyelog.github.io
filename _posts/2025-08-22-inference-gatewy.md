---
layout: post
title: Inference Gateway, llm-d
tags: []
comments: true
---

# Inference Gateway
## GKE Inference Gateway란?
- 오픈 소스 커뮤니티가 개발한 Kubernetes Gateway API Inference Extension입니다. 구글 클라우드는 이를 GKE 환경에 최적화하여 GKE Inference Gateway를 공개
- GKE 클러스터 내에서 L7 부하 분산기처럼 작동하며, 단순한 트래픽 분산을 넘어 모델의 내부 상태까지 파악하여 요청을 처리합니다. 그 결과 지능적인 라우팅, 자동 확장, 안전성 검사와 같은 고급 기능을 통해 AI 애플리케이션의 배포와 관리를 간소화합니다. 즉, 개발자는 기존 쿠버네티스 환경을 그대로 활용하면서도 고성능 AI 서비스를 손쉽게 운영할 수 있습니다.
### 핵심 기능
1. AI에 최적화된 부하 분산을 수행합니다. 기존의 부하 분산기와 달리 게이트웨이가 각 모델 서버의 Key-Value 캐시 활용률이나 대기 중인 요청 수를 실시간으로 파악하여 가장 여유 있는 서버로 요청을 전달합니다. 이 방식을 통해 지연 시간을 단축하고 처리량을 높일 수 있습니다. 이게 가능한 이유는 캐시 적중률을 높여 GPU 같은 가속기 자원을 한층 효율적으로 사용하기 때문입니다.
2. 추론 지표에 기반한 자동 확장 기능도 지원합니다. 단순히 요청 수뿐만 아니라, KV 캐시 활용률이나 토큰 대기열 길이 같은 추론 특화 지표를 기준으로 모델 서버(Pod) 수를 자동으로 조절할 수 있습니다. 이를 통해 요청이 급증할 때는 신속하게 자원을 늘려 서비스 품질을 유지하고, 한산할 때는 자원을 줄여 비용을 절감할 수 있습니다.
3. LoRA 모델의 동적 서빙에 최적화되어 있습니다. 이 기능을 활용하면 하나의 기본 모델 위에 여러 개의 경량 LoRA 어댑터를 동적으로 탑재하여 동시에 서비스할 수 있습니다. 가령 동일한 GPU에서 영어 분석 모델과 스페인어 분석 모델을 번갈아 가며 사용하는 것이 가능합니다. 덕분에 한정된 가속기 자원에 더 많은 모델을 배치하여 자원 효율과 비용 효율을 극대화할 수 있습니다.
4. 모델별 라우팅 및 트래픽 관리가 가능합니다. 게이트웨이가 HTTP 요청 본문을 직접 분석하여, JSON 필드에 지정된 모델 이름을 보고 해당 모델이 있는 서버 그룹으로 정확히 라우팅합니다. 이 기능은 여러 버전의 모델을 A/B 테스트하거나, 특정 모델에만 트래픽을 할당하는 등 유연한 배포 전략을 손쉽게 요청의 중요도에 따른 우선순위 처리 기능을 제공합니다. 모든 요청의 중요도가 같지 않다는 점을 고려하여 중요로 표시된 요청은 지연을 최소화하며 먼저 처리하고, 덜 중요한 배치 작업 등은 시스템 부하가 높을 때 의도적으로 지연시키거나 거부할 수 있습니다. 이를 통해 한정된 자원 안에서도 핵심 서비스의 안정적인 성능을 보장할 수 있습니다.
5. AI 보안 및 안전성 기능이 통합되어 있습니다. 게이트웨이 단에서 구글 클라우드의 Model Armor 서비스와 연동하여, 모든 프롬프트와 응답에 대한 유해성 검사 및 민감정보 필터링을 자동으로 수행합니다. 모든 모델에 일관된 보안 정책을 중앙에서 적용하므로, 기업은 안심하고 AI 서비스를 운영할 수 있습니다.
6. 추론 트래픽에 특화된 통합 관측성(Observability)을 제공합니다. 모델별 토큰 처리율, 대기열 길이, 캐시 적중률과 같은 상세 지표를 실시간으로 추적하여 서비스의 병목 지점을 찾고 운영을 최적화하는 데 필요한 통찰력을 얻을 수 있습니다.
## 참고
- Inference Gateway : https://www.megazonesoft.com/250601-gkellm/

# llm-d
- 2025년 Red Hat Summit에서 공개된 llm-d 커뮤니티는 오픈소스 생태계에서 생성형 AI 추론 혁신을 가속하는 중요한 진전입니다. llm-d는 vLLM과 Inference Gateway 위에 구축됐으며, Kubernetes 기반 아키텍처를 통해 대규모 추론 환경에 맞춰 vLLM의 기능을 확장합니다.

## Prefill and Decode Disaggregation
좋은 질문이에요. **Prefill and Decode Disaggregation**은 LLM 서빙(특히 vLLM, FasterTransformer, Megatron-LM 같은 시스템)에서 중요한 최적화 개념입니다. 간단히 말해, **"프롬프트 처리(prefill)"와 "생성(decoding)" 단계를 분리해서 처리한다**는 뜻이에요.

---

## 🔹 LLM 요청 처리 과정

LLM에 텍스트를 입력하고 응답을 얻을 때, 크게 두 단계가 있습니다:

1. **Prefill (Prompt Processing)**

   * 사용자가 입력한 \*\*전체 프롬프트(prompt tokens)\*\*를 모델에 넣어, \*\*KV 캐시(Key/Value cache)\*\*를 처음부터 채워 넣는 단계입니다.
   * 이 단계는 **병렬화가 잘 되고, GPU 활용도가 높음** (모든 토큰을 동시에 처리 가능).
   * 예: "Explain quantum mechanics in simple terms" → 이 문장을 토큰화해서 한 번에 통과시킴.

2. **Decode (Token-by-Token Generation)**

   * 이제 모델은 프롬프트 캐시를 바탕으로 **하나의 토큰씩 순차적으로 생성**합니다.
   * 각 스텝은 직전 토큰에 의존하기 때문에 **병렬성이 거의 없음**.
   * 예: "Quantum mechanics is ..." → 다음 단어 예측, 다시 다음 단어 예측 ...

---

## 🔹 Disaggregation (분리 처리)의 의미

일반적으로 모델 요청이 들어오면 프롬프트(Prefill)와 응답 생성(Decode)을 한 큐에서 처리했는데, 이걸 **분리**하면 장점이 있습니다:

* **자원 효율화**

  * Prefill은 한 번만 하고, Decode는 여러 요청을 효율적으로 합쳐서 처리 가능.
  * 특히 여러 사용자가 동시에 요청할 때, 프롬프트 길이는 다 달라도 생성 단계는 비슷하게 묶어서 처리 가능.

* **스케줄링 최적화**

  * 긴 프롬프트(예: 수천 토큰)와 짧은 프롬프트가 섞여 들어와도, 프롬프트 단계와 생성 단계를 분리하면 **대기 시간(latency)을 줄일 수 있음**.

* **서빙 안정성**

  * Prefill은 compute-intensive, Decode는 latency-sensitive인데, 따로 관리하면 GPU/TPU 자원 배분이 쉬워짐.

---

## 🔹 실제 예시

* vLLM 같은 엔진에서:

  * **Prefill 단계:** 입력 토큰을 한 번에 통과 → KV 캐시에 저장
  * **Decode 단계:** KV 캐시만 활용해 토큰 한 개씩 생성
    → 이렇게 분리하면 batch scheduling, continuous batching, speculative decoding 같은 최적화 기법과 결합 가능

---

## ✅ 정리

**Prefill and Decode Disaggregation** =
LLM 실행에서 \*\*프롬프트를 한 번에 처리하는 단계(prefill)\*\*와 \*\*응답을 순차적으로 생성하는 단계(decode)\*\*를 분리해서 실행하는 최적화 기법.

→ 장점: **GPU 효율↑, 지연시간↓, 멀티유저 처리 안정성↑**

---


좋아요! 아래는 **vLLM / sGLang** 기준으로 “Prefill–Decode 분리(disaggregation)”가 **실제로 어떻게 구현·스케줄링**되는지 한눈에 보이도록 정리한 흐름도, 핵심 자료구조, 그리고 의사코드입니다. (개념은 같고, 용어/옵션이 조금씩 달라요.)

# 1) 큰 그림: 파이프라인과 큐

```
[Request In]
    │
    ├── Tokenize → Build Request (max_new_tokens, stop, sampling, etc.)
    │
    ├── Prefill Queue (대량 병렬 처리, throughput-oriented)
    │         │
    │         └─> Batcher (prefill batch 구성)
    │               └─> Forward(prefill) → KV Cache write → seq 상태: READY_TO_DECODE
    │
    └── Decode Queue (스텝별 처리, latency-oriented)
              │
              └─> Scheduler (step 단위 aggregate)
                    └─> Forward(decode 1-step) → next token → Update KV/Logits
                         ├─ stop 조건 충족? → FINISH
                         └─ 아니면 → Decode Queue 재삽입(다음 스텝)
```

* **Prefill**: 입력 프롬프트 전 토큰을 한 번에 통과 → **KV 캐시 채움**. 대량 병렬화 가능 → **GPU 활용도↑**
* **Decode**: 한 스텝(1 토큰)씩 생성 → **병렬성↓, 레이턴시 민감**. 다수 요청을 step단위로 **continuous batching**으로 묶어 처리

# 2) 핵심 자료구조(개념)

* `Request`: 한 사용자의 요청(프롬프트, max\_new\_tokens, stop 규칙, temperature 등)
* `Sequence`: 실행 단위. `state ∈ {PREFILL_PENDING, DECODING, FINISHED}`
* `KVCacheHandle`: (layer, head, seq\_len)-별 **paged KV 캐시** 포인터(메모리 페이지 단위 할당/회수)
* `PrefillBatch`: 여러 요청의 **프롬프트 텐서**를 pad/pack하여 한 번에 전파
* `DecodeBatch`: 여러 시퀀스의 **마지막 토큰**을 모아 step 전파
* `Scheduler/Batcher`: 큐에서 뽑아 batch를 만들고, 메모리(KV 페이지), 토큰 수, SLA 기준으로 **합/분리** 의사결정

# 3) 스케줄러 루프(의사코드)

```python
while True:
    # 1) 수신된 요청을 Prefill Queue에 적재
    drain_incoming_requests_into(prefill_q)

    # 2) Prefill 우선 실행 (GPU가 놀지 않도록 큰 덩어리 우선)
    if not prefill_q.empty() and gpu_has_room():
        batch = make_prefill_batch(prefill_q, max_tokens_budget, max_batch_size)
        logits, kv_writes = model.forward_prefill(batch.prompt_tokens)
        kv_cache.commit(kv_writes)  # KV 페이지 할당/갱신
        for seq in batch.sequences:
            seq.state = DECODING
            decode_q.push(seq)

    # 3) Decode 스텝 실행 (레이턴시 민감; step 단위 묶기)
    if not decode_q.empty() and gpu_has_room():
        step_batch = make_decode_batch(decode_q, max_active_seqs, max_context_budget)
        logits, kv_writes = model.forward_decode(step_batch.last_tokens)
        kv_cache.commit(kv_writes)
        for seq, logit in zip(step_batch.sequences, logits):
            next_tok = sample_token(logit, seq.sampling_params)
            seq.append(next_tok)
            if is_stop(seq) or seq.gen_len >= seq.max_new_tokens:
                seq.state = FINISHED
                finalize(seq); free_kv_pages(seq)
            else:
                # 다음 step을 위해 다시 decode 큐로
                decode_q.push(seq)

    # 4) 메모리 압력 해소 (e.g., OOM 예방/회수)
    if kv_cache.pressure_high():
        evict_policies_run()  # 끝난 seq 회수, 미사용 페이지 반환, low-priority seq delay 등
```

> 포인트
>
> * **Prefill 먼저** 큰 덩어리로 묶어 KV를 “한 방에” 채우고,
> * 그 다음 **Decode**를 다수 시퀀스의 **마지막 토큰들**로 묶어 **한 스텝 전파**
> * 둘 다 **토큰/메모리 예산**을 계산해 batch 크기를 의사결정

# 4) vLLM에서의 구현 포인트

* **Paged KV Cache**: KV를 고정 크기 **페이지** 단위로 관리 → 긴 프롬프트/많은 동시 세션도 **메모리 단편화↓**
* **Continuous Batching**: 프롬프트 길이/생성 길이가 다른 시퀀스를 **prefill 단계와 decode 단계를 분리**해서 매 스텝 최적 조합으로 묶음
* **Scheduler 정책**(요지)

  * **토큰 예산 기반**: 한 스텝에 허용 가능한 total tokens와 KV page 여유를 기준으로 batch 크기 결정
  * **Prefill/Decode time-slice**: 짧은 프롬프트가 오래 대기하지 않도록 **prefill 빈도**도 보장
* (옵션 예시)

  * `--max-num-seqs` / `--gpu-memory-utilization` : 활성 시퀀스/메모리 상한
  * `--max-logprobs` / `--max-num-batched-tokens` : 배치 토큰 예산
  * speculative, beams, parallel sampling 등과도 조합

# 5) sGLang에서의 포인트(요지)

* **락-프리/낮은 오버헤드 런타임** 지향, fine-grained 스케줄링
* Prefill과 Decode를 **독립 큐**로 두고, **레이턴시 민감한 decode 스텝에 우선권**을 주되, prefill starvation 방지
* 커스텀 **program DAG/graph** 상에서 LLM 호출을 노드로 보고, **노드 간 KV 캐시 재사용** 최적화

# 6) 실제 한 스텝이 하는 일 (Decode)

```
[sequences: N개]  ──(마지막 토큰들 모음)──>  [Embedding + PosEnc]
      │                                 │
      └───── shared KV (prefill 때 생성) ─┘
                    │
             [Transformer Layers]
                    │
                 [Logits]
                    │
               [Sample/Top-k]
                    │
           [Append → stop? → 재삽입/종료]
```

* Decode는 **직전 토큰 1개만** 새로 전파, 나머지는 **KV 캐시 재사용**
* 그래서 **KV 메모리 대역폭**과 **캐시 페이지 접근**이 병목이 되기 쉬움 → **paged KV**와 **정렬된 batch 구성**이 중요

# 7) Speculative Decoding과의 결합(선택)

* **Draft 모델**로 여러 토큰을 미리 제안 → 메인 모델이 **한 번의 step에서 여러 토큰 검증**
* Prefill/Decode 분리 구조 덕분에, 검증 자체를 **decode 스텝의 확장판**으로 스케줄러에 얹기 좋음
* 장점: **토큰/스텝 수 감소 → 레이턴시↓**

# 8) 빈번한 이슈 & 해결 팁

* **Prefill이 길어 decode가 굶는 문제**: 스케줄러에서 **prefill–decode 비율 가드**(예: 타임슬라이스, max prefill tokens/step)
* **OOM/메모리 압력**: `paged_kv` 활성, **max active seqs** 제한, **KV eviction 정책**(종료 즉시 회수, low-priority 지연)
* **짧은 요청이 긴 요청에 끌려 느려짐**: **length-based bucketing**으로 유사 길이끼리 묶어 prefill/step 구성
* **Throughput vs Latency 트레이드오프**:

  * 대량 오프라인/배치형: prefill 크게, decode 묶음 크게
  * 대화형: decode batch는 작게, prefill 타임슬라이스 짧게

# 9) 간단한 설정 가이드(감각치)

* **대화형(짧은 답변, 많은 동시 사용자)**

  * vLLM: `--gpu-memory-utilization 0.85`
    `--max-num-seqs` 적당 (수백), decode batch 작게(레이터시 우선)
    speculative on(가능하면)
* **분석/요약(긴 프롬프트, 중간 길이 생성)**

  * prefill 토큰 예산 넉넉히, **prefill 우선 스케줄**
  * decode는 length-bucketing으로 step 효율화
* **스트리밍**: step 주기 짧게, **decode 빈도 높게**

# 10) 미니 의사코드(연산/메모리 예산 포함)

```python
TOKENS_BUDGET_PER_FORWARD = 8192   # 예: 모델/하드웨어별 경험값
MAX_ACTIVE_SEQS = 256

def make_prefill_batch(q, budget):
    batch, used = [], 0
    while q and used + q.peek().prompt_len <= budget:
        req = q.pop()
        batch.append(req)
        used += req.prompt_len
    return pack_prefill(batch)  # pad/pack, position ids 계산

def make_decode_batch(q, max_seqs, budget):
    batch, used = [], 0
    while q and len(batch) < max_seqs:
        seq = q.pop()
        # decode는 보통 1 token/seq, 하지만 KV 길이에 따라 attn cost 추정
        step_cost = est_attn_cost(seq.context_len)  # 예: O(context_len)
        if used + step_cost > budget: break
        batch.append(seq); used += step_cost
    return pack_decode(batch)   # 마지막 토큰만 모아 텐서화

while True:
    # fairness: decode 한 번, prefill 한 번 식으로 라운드-로빈도 가능
    if should_run_decode():
        step = make_decode_batch(decode_q, MAX_ACTIVE_SEQS, TOKENS_BUDGET_PER_FORWARD)
        run_decode_step(step)
    if should_run_prefill():
        pb = make_prefill_batch(prefill_q, TOKENS_BUDGET_PER_FORWARD)
        run_prefill(pb)
```

---

필요하시면, \*\*당신이 쓰는 세팅(vLLM인지 sGLang인지, GPU/VRAM, 기대 동접, 요청 길이 분포)\*\*에 맞춰 \*\*권장 스케줄러 파라미터(토큰 예산, batch 크기, speculative on/off)\*\*를 바로 산출해서 드릴게요.


## 참고
- NVIDIA Dynamo, 대규모 분산 추론 발전을 위한 llm-d 커뮤니티 이니셔티브 가속화 : https://developer.nvidia.com/ko-kr/blog/nvidia-dynamo-accelerates-llm-d-community-initiatives-for-advancing-large-scale-distributed-inference/