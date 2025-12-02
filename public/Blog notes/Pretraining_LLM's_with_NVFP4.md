---
title: "Thoughts on pretraining LLM's with NVFP4"
date: "2025-12-02"
updated: "2025-12-02 | 12:00 PM"
description: "Exploring Nvidia's new FP4 format for training large language models and its implications for AI development."
tags: ["AI", "LLM", "NVIDIA", "technical"]
featured: true
---

**Why**:  
The biggest bottleneck in AI right now isn't just intelligence; it's the cost of computers. Training a model requires tens of thousands of H100s. Nvidia's solution? Stop trying to make the chips bigger, and start making the data smaller.

And I mean why would a company like Nvidia, which a big part of their revenue comes from research labs, companies, and people buying the products necessary for this, concern themselves about making training easier and better on less compute?

I think that’s one of the things that make Nvidia great.

(But also remember that this new floating point they are developing only works on Blackwell GPU’s which means they have complete control over what goes)

“While 8-bit floating point (FP8) training is now widely adopted, transitioning to even narrower precision, such as 4-bit floating point (FP4), could unlock additional improvements in computational speed and resource utilization. However, quantization at this level poses challenges to training stability, convergence, and implementation, notably for large scale models trained on long token horizons.”

INT8 (another bit data type) but the reason why Nvidia focuses so much on FP8 is because this format is more flexible\! But, at the same time it requires specific hardware to achieve the desired performance. 

So there are pros and cons to this\!

To be basic:  
**FP8** everybody within the industry knows about this is currently the “gold standard”  for AI on H100 GPUs. It is balanced with speed and accuracy that is easy to adopt.

**Why is FP8 important**  
		  
![image1](/Blog%20notes/images/image1.png)  
(this image is generated with nano banana)

**NVFP4** Nvidia’s new baby format for Blackwell B200 GPUs. It doubles throughput and halves memory usage compared to FP8. It also requires specific hardware and complex quantization recipes to maintain accuracy.

If you like cars like me the **easier** way to see this is:  
FP8: Imagine a Porsche 911 GT3. It is incredibly fast and high-performance, but it still has a windshield, air conditioning, and passenger seats. It’s balanced and you can drive it fast without being a professional racing driver.

NVFP4: This is what happens when you strip the car down to the absolute bare minimum to save weight. You’ve removed the AC, the glass, and the passenger seat (this is Quantization removing bits to save memory). It becomes a delicate machine that expects professional control and specific strategies to keep the car together without it being destroyed the moment it's met with something unexpected.

Some neural networks layers use different types of data points within their whole ecosystem\!

While reading I also stopped to watch this [video because](https://youtu.be/qoQJq5UwV1c?si=x_v9K3s4OfNWnr-M) the paper goes deep into the floating point arguments. So there were some key concepts I wanted to truly understand.

**Ok now [Nvidia’s paper](https://arxiv.org/html/2509.25149v1) right?**

Researchers at Nvidia used a 12B-parameter hybrid Mamba-Transformer model with a specific mixed precision recipe to converge:  
**Forward Pass:**

* Inputs/Weights: Quantized to **NVFP4**.  
* Rounding: **Round-to-Nearest (RTN)**.  
* Output: Accumulated in FP32 or BF16.

**Backward Pass (Gradients):**

* Gradients: Quantized to **NVFP4**.  
* Rounding: **Stochastic Rounding (SR)**. This is mandatory. Deterministic rounding in 4-bit will cause gradients to vanish which stalls training.

**Master Weights:** Kept in BF16 or FP32.

These master weights are key to this process because we train in 4-bit to go fast, but the "true" knowledge in 16-bit so the model doesn't get "dementia" from the rounding errors. This is the "Mixed Precision" recipe.

They are using NVFP4 to train LLMs faster and more efficiently without losing that precision that you would suffer at such low values.

Key details from each section in the paper:  
Section 2: describes the format   
Section 3: Results  
Section 4: training methodology for NVFP4  
Section 5 comparison

In the paper not the whole experiment is done in NVFP4 at the end there is a transformation from Nvfp4 to bf16 (can even do mxfp8)

Here is also a more in depth detail of the process:

(image from [https://arxiv.org/html/2509.25149v1](https://arxiv.org/html/2509.25149v1) )

The diagram explains how things are broken into multiple transformation steps where different data points are used to create a final DGRAD(NVFP4 GEMM)

As always we have 2 main layers **Forward Pass** (Learning) and the **Backward Pass** (correcting)

Explained in the next pages \-\>

**The forward pass** (top)  
Its main goal is to take information from the previous layer, process it, and send it to the next layer.I broke this process into 4 main layers I felt it was easier to understand that way and also show it with a diagram![image2](/Blog%20notes/images/image2.png)  
**Input from layer i \- 1:**  
Data arrives as a BF16 Activation. This is the output of the previous layer’s calculation.

**Quantization:**  
Because this architecture aims for high speed, it doesn’t do the heavy math in 16-bit. Instead, the “Quantize to NVFP4” block compresses the data down to 4-bit floating point (NVFP4)

**The Calculation (FPROP):**

* The 4-bit input meets the weights. Which btw\! The weights are stored in high-precision FP32 but are also Quantized to NVFP4 on the fly.  
* These two 4-bit streams meet in the green box FPRO (NVFP4 GEMM). This is the “Forward propagation” matrix multiplication.

**Output to layer i \+ 1**  
Finally everything is converted back to BF16 this is essentially the input for the next layer in the chain.

**The backward pass** (bottom)  
Take the error signals from the future layers, figure who is responsible, and update the weights.

* **Input from layer i \+ 1:**  
  * the BF16 Activation gradient. This could be represented as the “feedback” or “error report” coming back from the end of the neural network.  
* **Splitting the Signal:**  
  * Incoming gradient is used for 2 different jobs.

This process is broken into two jobs. Job A and B which I tried to do a single diagram for both but I wasn’t able to because the text would look too small in here so I broke it into two although it is important to mention these two happen concurrently.

**Job A: Tell the previous layer (DGRAD)**  
**![image3](/Blog%20notes/images/image3.png)**  
The gradient is quantized to NVFP4 (using SR \- Stochastic Rounding, to preserve accuracy in low precision).

Then it enters the DGRAD (NVFP4 GEMM) at this same place it is multiplied by the transposed weights.  
The result is the calculated error that is sent out to the bottom left: “Activation Gradient to layer i-1”. Now layer i \- 1 knows how to correct itself.  
**Job B: Update the weights (WGRAD)**

 ![image4](/Blog%20notes/images/image4.png)  
This part calculates how the weights inside this specific layer need to change.

It takes the incoming gradient (from layer i \+ 1\) **AND** the original input (saved from the Forward Pass, see the line coming down from the top left).

**Hadamard Transform:** For clarification in the original graph and in this one some of you saw that there is an extra step to all this which is the “Hadamard Transform”. Think of the Hadamard Transform as a blender. It takes data that has huge spikes (outliers) which are hard to quantize, and 'smooths' them out so the data is uniform and easier to fit into the tiny 4-bit container.

The output from this transformation enters the WGRAD

**The final result**: The output goes to the Optimizer which updates the master FP32 Weights.

**Final thoughts**  
Quantization as we know it is not only the key to better and more efficient technologies but also the next step in the evolution of AI.

**As I mentioned before, the** fact that this type of technology can only be run on Nvidia’s Blackwell GPU’s might be concerning for the future of this technology as it traps you into Nvidia’s ecosystem. Considering that we have seen how other hardware solutions such as [Google’s TPU](https://cloud.google.com/tpu) have started to produce better results.

Google is betting their cash on INT4 native support on TPUs for running bigger models which while inferior to NVFP4 (because floating point is just better than int for training) it is the current king due to its massive support on multiple platforms. 

Other solutions such as MXFP4 are fighting to become the standard in the world of training and inference because this means that we wouldn’t have such a heavy dependency on Nvidia’s hardware. This format is the open standard that companies like AMD, Intel, etc are trying to develop to stop Nvidia from owning the physics of AI numbers.

**So what’s next\!**  
If you are interested in quantization this paper is key on understanding the different concepts and how new formats are evolving at a really high rate. I really would like to explore more of this and perhaps experiment with it. Perhaps it would be fun to make a project that aims to replicate NVFP4 on C++ (keep an eye for this) just for the sake of understanding the concept even more.

**Pd:**  
To Nvidia’s researchers, [Julia Turc](https://www.youtube.com/@juliaturc1), and the people who inspire me to grow every day thanks for being amazing and producing great work

**Stuff I don't fully grasp and need to revise:**   
“While microscaling reduces the dynamic range needed to represent tensor values, outliers can still have a disproportionate impact (An et al., [2025](https://arxiv.org/html/2509.25149v1#bib.bib3); Park et al., [2025](https://arxiv.org/html/2509.25149v1#bib.bib21); Raman et al., [2025](https://arxiv.org/html/2509.25149v1#bib.bib22); Dettmers et al., [2022](https://arxiv.org/html/2509.25149v1#bib.bib11); Xiao et al., [2024](https://arxiv.org/html/2509.25149v1#bib.bib29)) on FP4 formats, degrading model accuracy. Random Hadamard transforms (Shah et al., [2024](https://arxiv.org/html/2509.25149v1#bib.bib24); Ashkboos et al., [2025](https://arxiv.org/html/2509.25149v1#bib.bib5), [2024](https://arxiv.org/html/2509.25149v1#bib.bib4); Tseng et al., [2024](https://arxiv.org/html/2509.25149v1#bib.bib25), [2025a](https://arxiv.org/html/2509.25149v1#bib.bib26); Malinovskii et al., [2024](https://arxiv.org/html/2509.25149v1#bib.bib14)) address this by redistributing outliers into an approximately Gaussian distribution, making them easier to represent in narrower formats. Below we discuss the application of Random Hadamard transforms in FP4 training.” (I need to revise some of the vocabulary in here)

Stochastic Rounding

Hadamard Transform

https://www.baseten.co/blog/fp8-efficient-model-inference-with-8-bit-floating-point-numbers/  
https://www.scaleway.com/en/docs/gpu/reference-content/understanding-nvidia-fp8/  
https://arxiv.org/pdf/2209.05433  
[https://www.alleducationjournal.com/assets/archives/2025/vol10issue2/10031.pdf](https://www.alleducationjournal.com/assets/archives/2025/vol10issue2/10031.pdf)  
https://developer.nvidia.com/blog/floating-point-8-an-introduction-to-efficient-lower-precision-ai-training/




