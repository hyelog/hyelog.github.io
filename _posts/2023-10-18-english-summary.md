---
layout: post
title: Using Causal ML Instead of A/B Testing
subtitle: IT Trend and english summary
tags: [IT, ML, english]
thumbnail-img: /assets/img/2023-10-18/1_hqvlyc5JDb9x8HkywX0u6.png
comments: true
---

# Using Causal ML Instead of A/B Testing
[Link](https://towardsdatascience.com/using-causal-ml-instead-of-a-b-testing-eeb1067d7fc0)

# Need to learn English
1. In this case, we will have `the following` : 이 경우 다음과 같은 정보가 제공됩니다.
2. I want to `stress this point` because it is very important

# Summary
- One of the requirements of A/B tests is not running too many tests at the same time, because they can “contaminate” each other’s outcomes.
- Causal ML to the rescue
    - For the sake of simplicity, let’s assume that both the actions period (yellow band in the image) and the outcome period (blue band) must be one month long.
    ![Time dimension of predictive models. [Image by Author]](/assets/img/2023-10-18/1_hqvlyc5JDb9x8HkywX0u6.png)
    ![Our dataset after data preparation. [Image by Author]](/assets/img/2023-10-18/1_yeZjBAVB4ndHPWNkOu1BQQ.png)
    - With these two ingredients, we are now able to train any machine learning model.
- `We can only change treatment variables, never covariates.`
    - ![Simulation of different scenarios using Causal ML. [Image by Author]](/assets/img/2023-10-18/1_9G4UeN7KkTxarI9gyy0qMA.png)
