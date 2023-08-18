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

### 1.4 회문 수열
(bit 연산)[https://shoark7.github.io/programming/knowledge/some-useful-bit-tricks-and-usages]


#### (1 << n): n번째 비트 켜기
```python
def get_nth_bit(n, nth):
    return 1 if n & (1 << nth) else 0
```
확인할 n과, nth번째 비트를 켠 수를 & 연산하면 두 값이 모두 다르다면 0, 같은 값이 있다면 1

#### n개의 비트 모두 1로 만들기

(1 << n) - 1

```python
def get_trailing_bits(n, count):
    return n & ((1 << count) - 1)
```
마지막 count개수의 숫자를 출력

#### 정수의 2의 지수승 여부 확인

```python
def is_exp_binary(n):
    return n & (n - 1) == 0
```

#### 2진수에서 1 비트의 개수 구하기
```python
def count_bit(n):
    return n % 2 + count_bit(n // 2) if n >= 2 else n
```

```python
def bit_count(n):
    k = 0
    count = 0

    while n >= (1 << k):
        if n & (1 << k) != 0:
            count += 1
        k += 1

    return count
```
#### 차집합: 비트 연산으로 구현하기
```python
def diff(n, d):
    return n & ~(1 << d)
```
