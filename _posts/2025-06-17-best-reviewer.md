---
layout: post
title: 2025 Best Reviewer
subtitle: Refactoring
tags: [design-pattern, best-reviewer]
comments: true
---

switch 구문 쓰면 좋은 경우
* 보통은 안좋음
- 범주화된 경우
- 

If 문 쓰는 경우
- 처리해야하는 게 분명할때

디자인 패턴 관점: 조건문을 대체할 수 있는 구조
많은 if/switch가 생기면 다음과 같은 패턴을 고려합니다:

1. 전략 패턴 (Strategy Pattern)
상황: 조건에 따라 알고리즘이나 동작을 선택해야 할 때

대체 예시:

java
복사
편집
// Before - switch 문
switch (paymentType) {
    case "CARD": payWithCard(); break;
    case "BANK": payWithBank(); break;
    case "CASH": payWithCash(); break;
}
java
복사
편집
// After - 전략 패턴
interface PaymentStrategy {
    void pay();
}

class CardPayment implements PaymentStrategy {
    public void pay() { System.out.println("카드 결제"); }
}

class CashPayment implements PaymentStrategy {
    public void pay() { System.out.println("현금 결제"); }
}

Map<String, PaymentStrategy> paymentMap = Map.of(
    "CARD", new CardPayment(),
    "CASH", new CashPayment()
);

paymentMap.get(type).pay();
2. 커맨드 패턴 (Command Pattern)
상황: 키 입력, 버튼 클릭 등 사용자 액션에 따라 동작이 달라질 때 (switch로 처리하던 부분)

대체 예시:

java
복사
편집
// Before
switch (keyPressed) {
    case "UP": moveUp(); break;
    case "DOWN": moveDown(); break;
}

// After
interface Command {
    void execute();
}

class MoveUpCommand implements Command {
    public void execute() { moveUp(); }
}

Map<String, Command> commandMap = Map.of(
    "UP", new MoveUpCommand(),
    "DOWN", new MoveDownCommand()
);

commandMap.get(keyPressed).execute();
3. 다형성 이용 (Polymorphism)
switch/if 대신 상속 구조에서 오버라이딩으로 대체

java
복사
편집
// Before
switch (animalType) {
    case "Dog": System.out.println("멍멍"); break;
    case "Cat": System.out.println("야옹"); break;
}

// After
abstract class Animal {
    abstract void speak();
}

class Dog extends Animal {
    void speak() { System.out.println("멍멍"); }
}
✅ 언제 if/switch를 그대로 써도 되는가?
단순한 조건 2~3개 정도일 때는 괜찮습니다.

조건 로직이 복잡하지 않고 변경 가능성도 낮을 때

성능상 오버헤드를 피해야 할 때 (디자인 패턴 도입이 과할 경우)

✅ 언제 패턴으로 대체해야 하나?
기준	설명
조건 분기가 많고 복잡할 때	4~5개 이상 if/switch가 반복되면
새로운 분기 케이스가 자주 추가될 때	변경에 유연하게 대응하기 위해
테스트/유지보수가 어려워질 때	전략화하면 단위 테스트가 쉬워짐
객체 행동을 상황에 따라 다르게 해야 할 때	다형성이나 전략 패턴으로 분리

✅ 결론 요약
✔ 간단한 분기에는 if/switch를 써도 OK
✔ 복잡한 분기, 자주 변하는 조건, 책임 분리가 필요한 경우엔 디자인 패턴을 고려하세요
특히 Strategy, Command, State, Polymorphism은 switch/if를 깔끔하게 대체합니다.