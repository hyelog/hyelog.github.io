---
layout: post
title: coding-test, array, string
subtitle: the Coding interview
gh-repo: hyelog/coding-test
tags: [test, coding, interview]
comments: true
---

# Array and String

## 기본 상식

### ASCII code vs Unicode 

#### ASCII : Amarican Standard Code for Information Interchange

7bit, `128`개의 고유한 값만 사용
1bit는 통신 에러 검출을 위해 사용 = Parity Bit

#### ANSI code 

8비트로 확장한 ASCII 코드
`256`개 

#### Unicode

전 세계 언어의 문자를 정의하기 위한 국제 표준 코드
2byte (65536)

## 코드

### 1.1 중복 체크
#### 1.1.1 해답
시간 복잡도 O(n) (n은 문자열의 길이)
공간 복잡도 O(1)

#### 1.1.2 해답
공간을 1/8로 줄임.
문자열이 소문자 a부터 z까지 구성된다고 가정