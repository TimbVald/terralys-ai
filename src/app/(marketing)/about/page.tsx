"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Latex from 'react-latex-next';
import "katex/dist/katex.min.css";

const latexStyle = { fontSize: '1.1rem' };

export default function AboutPage() {
  const lossFunction = `$$
L(x, y, w, h, C, p) = 
\\underbrace{
    \\lambda_{\\text{coord}} \\sum_{i=0}^{S^2} \\sum_{j=0}^{B} \\mathbf{1}_{ij}^{\\text{obj}} 
    [ (x_i - \\hat{x}_i)^2 + (y_i - \\hat{y}_i)^2 ]
}_{\\textcolor{#82ca9d}{\\text{Localization Loss (Center)}}}$$`;

  const lossFunctionSize = `$$
+ \\underbrace{
    \\lambda_{\\text{coord}} \\sum_{i=0}^{S^2} \\sum_{j=0}^{B} \\mathbf{1}_{ij}^{\\text{obj}} 
    [ (\\sqrt{w_i} - \\sqrt{\\hat{w}_i})^2 + (\\sqrt{h_i} - \\sqrt{\\hat{h}_i})^2 ]
}_{\\textcolor{#8884d8}{\\text{Localization Loss (Size)}}}$$`;

  const lossFunctionConfidence = `$$
+ \\underbrace{
    \\sum_{i=0}^{S^2} \\sum_{j=0}^{B} \\mathbf{1}_{ij}^{\\text{obj}} (C_i - \\hat{C}_i)^2
}_{\\textcolor{#ffc658}{\\text{Confidence Loss (Object)}}}$$`;

  const lossFunctionNoObject = `$$
+ \\underbrace{
    \\lambda_{\\text{noobj}} \\sum_{i=0}^{S^2} \\sum_{j=0}^{B} \\mathbf{1}_{ij}^{\\text{noobj}} (C_i - \\hat{C}_i)^2
}_{\\textcolor{#ff8042}{\\text{Confidence Loss (No Object)}}}$$`;

  const lossFunctionClass = `$$
+ \\underbrace{
    \\sum_{i=0}^{S^2} \\mathbf{1}_{i}^{\\text{obj}} \\sum_{c \\in \\text{classes}} (p_i(c) - \\hat{p}_i(c))^2
}_{\\textcolor{#a4de6c}{\\text{Classification Loss}}}$$`;


  return (
    <div className="container mx-auto px-4 py-12 font-sans">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">YOLO: An Algorithmic Analysis</h1>
      </header>

      <div className="space-y-10 max-w-5xl mx-auto">

        <Card className="border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-700">Algorithm Techniques used in YOLO</CardTitle>
            <CardDescription>How state-of-the-art AI leverages fundamental algorithmic concepts.</CardDescription>
          </CardHeader>
          <CardContent className="text-base space-y-4">
            <p>The YOLO algorithm, while a modern deep learning architecture, is built upon a foundation of classic computer science principles. Here’s how it maps to your Design and Analysis of Algorithms syllabus:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong className="text-purple-600">Divide and Conquer </strong> YOLO's primary strategy is to divide the image into an S x S grid. Each cell is responsible for a smaller subproblem (detecting objects within its boundary), and the results are combined to form the final detection map.</li>
              <li><strong className="text-purple-600">Greedy Technique </strong> The crucial post-processing step, Non-Max Suppression (NMS), is a classic greedy algorithm. It iteratively selects the best local solution (the box with the highest confidence) and eliminates redundant neighbors.</li>
              <li><strong className="text-purple-600">Dynamic Programming </strong> The convolutional neural network (CNN) at the heart of YOLO shares principles with dynamic programming. It builds up complex features in later layers by reusing and combining simpler features computed in earlier layers, storing this information in its learned weights.</li>
              <li><strong className="text-purple-600">NP-Complete Problems </strong> Finding the absolute optimal set of bounding boxes for all objects in an image is an NP-Hard problem. YOLO provides a highly efficient polynomial-time approximation to this problem, making real-time detection feasible.</li>
               <li><strong className="text-purple-600">Brute Force </strong> YOLO's unified regression approach is a significant improvement over older, brute-force methods like the sliding window technique, which would inefficiently scan an image at multiple scales and locations.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-700">The CNN Architecture: YOLO's Engine</CardTitle>
            <CardDescription>YOLO's predictive power comes from a deep Convolutional Neural Network (CNN). Let's break down its essential layers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg">1. The Convolutional Layer</h4>
              <p>This is the primary building block. It uses a set of learnable filters (or kernels) to detect features in the input image.</p>
              <ul className="list-disc list-inside space-y-3 pl-4 mt-2">
                <li>
                  <strong className="text-orange-600">Kernel (Filter):</strong> A small matrix of weights (e.g., 3x3 pixels). The network learns the values in these matrices. Each kernel is specialized to detect a specific feature, like a vertical edge, a specific color, or a more complex texture.
                </li>
                <li>
                  <strong className="text-orange-600">Convolution Operation:</strong> The kernel slides over the input image, computing the dot product at each position. This creates a "feature map" that highlights where the specific feature was detected.
                </li>
                <li>
                  <strong className="text-orange-600">Stride (S):</strong> The number of pixels the kernel moves at a time. A stride of 1 moves pixel-by-pixel, while a stride of 2 skips every other pixel, reducing the output size.
                </li>
                <li>
                  <strong className="text-orange-600">Padding (P):</strong> Adding a border of zeros around the input image. This allows the kernel to process the edges of the image more effectively and can control the output size.
                </li>
              </ul>
              <p className="mt-3 font-semibold">The output size of a feature map is calculated as: <Latex>{'$O = (W - K + 2P)/S + 1$'}</Latex></p>
              <p className="text-sm text-muted-foreground mt-1">For example, a 28x28 input (W=28) with a 3x3 kernel (K=3), zero padding (P=0), and a stride of 1 (S=1) results in a (28-3+0)/1 + 1 = 26x26 output feature map.</p>
            </div>

            <div>
              <h4 className="font-semibold text-lg">2. The Activation Layer (ReLU)</h4>
              <p>After each convolution, an activation function is applied. The most common is the Rectified Linear Unit (ReLU), which simply converts all negative pixel values in the feature map to zero. This introduces non-linearity, allowing the network to learn far more complex patterns than simple linear combinations.</p>
            </div>

            <div>
              <h4 className="font-semibold text-lg">3. The Pooling Layer (Max Pooling)</h4>
              <p>This layer performs down-sampling to reduce the computational load and make feature detection more robust to small shifts in position. It slides a window (e.g., 2x2) over the feature map and, for each patch, outputs only the maximum value. This retains the most prominent features while discarding less important information.</p>
            </div>

            <div>
              <h4 className="font-semibold text-lg">4. The Fully Connected Layer</h4>
              <p>After several cycles of convolution and pooling, the high-level feature maps are flattened into a single vector. This vector is then fed into one or more fully connected layers, which perform the final classification and localization tasks to produce the bounding box coordinates and class probabilities that YOLO outputs.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700">The YOLO Prediction Pipeline: A Step-by-Step View</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3">
                <li><strong>Input Image & Grid Division (Divide and Conquer):</strong> The input image is resized to a standard size (e.g., 448x448) and conceptually divided into an S x S grid (e.g., 7x7).</li>
                <li><strong>Single Forward Pass (Dynamic Programming):</strong> The image is passed once through the deep CNN we just described. The network's layers progressively extract features, from simple edges to complex object parts.</li>
                <li><strong>Tensor Generation:</strong> The final layer outputs a single tensor of shape S x S x (B * 5 + C). For S=7, B=2, C=20, this is a 7x7x30 tensor. This tensor is the algorithmic heart of YOLO, encoding all predictions for all grid cells simultaneously.</li>
                <li><strong>Decoding the Tensor:</strong> Each 1x1x(B*5+C) vector in the tensor is interpreted to get bounding box coordinates, confidence scores, and class probabilities for a specific grid cell.</li>
                <li><strong>Filtering and Non-Max Suppression (Greedy Algorithm):</strong> The raw predictions are filtered. First, boxes with low confidence scores are discarded. Then, the Non-Max Suppression algorithm is applied to eliminate redundant detections for the same object.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">The Multi-Part Loss Function: The Training Rule</CardTitle>
            <CardDescription>How YOLO learns from its mistakes during training.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800">Where Does the Loss Function Fit In?</h4>
                <p className="text-blue-700">The "Prediction Pipeline" describes what happens during <strong className="font-bold">inference</strong>—when the trained model makes a prediction on a new image. The loss function, however, is only used during <strong className="font-bold">training</strong>.</p>
                <p className="mt-2 text-blue-700">During training, the model's predictions are compared to the ground-truth labels (the correct answers). The loss function calculates a single number representing how "wrong" the model's predictions were. An optimization algorithm (like Gradient Descent) then uses this loss value to slightly adjust all the weights in the CNN (e.g., in the kernels) to make the predictions better next time. This process is repeated thousands of times.</p>
            </div>
            <p className="pt-4">The loss function is a sum-squared error broken into several parts. Note that <Latex>{'$\\mathbf{1}_{ij}^{\\text{obj}}$'}</Latex> is an indicator function, equal to 1 if the j-th bounding box in cell i is responsible for detecting an object.</p>
            <div className="p-4 bg-muted rounded-lg space-y-4">
                <div style={latexStyle}><Latex>{lossFunction}</Latex></div>
                <div style={latexStyle}><Latex>{lossFunctionSize}</Latex></div>
                <div style={latexStyle}><Latex>{lossFunctionConfidence}</Latex></div>
                <div style={latexStyle}><Latex>{lossFunctionNoObject}</Latex></div>
                <div style={latexStyle}><Latex>{lossFunctionClass}</Latex></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-cyan-500">
          <CardHeader>
            <CardTitle className="text-2xl text-cyan-700">Deconstructing the Loss Function: A Glossary</CardTitle>
            <CardDescription>Understanding the variables that drive YOLO's learning process.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 font-mono text-sm">
              <li><Latex>{'$\\lambda_{\\text{coord}}$'}</Latex>: <span className="font-sans text-base">A scaling factor (e.g., 5) that heavily prioritizes accurate bounding box predictions. This tells the model that getting the box location right is the most important job.</span></li>
              <li><Latex>{'$\\lambda_{\\text{noobj}}$'}</Latex>: <span className="font-sans text-base">A small scaling factor (e.g., 0.5) that reduces the impact of the vast majority of grid cells that don't contain an object. Without this, the model would become overly cautious and fail to detect anything.</span></li>
              <li><Latex>{'$\\mathbf{1}_{ij}^{\\text{obj}}$'}</Latex>: <span className="font-sans text-base">The "indicator function." It equals 1 only if the j-th bounding box predictor in grid cell i is the one designated as "responsible" for detecting the ground-truth object whose center falls in that cell. This ensures only one predictor is penalized for a given object.</span></li>
              <li><Latex>{'$(w_i, h_i)$'}</Latex> & <Latex>{'$(\\hat{w}_i, \\hat{h}_i)$'}</Latex>: <span className="font-sans text-base">Predicted and true box width/height. The square roots are a clever trick: they ensure that small errors in small boxes are penalized more heavily than the same absolute error in a large box, improving accuracy for objects of all sizes.</span></li>
              <li><Latex>{'$C_i$'}</Latex> & <Latex>{'$\\hat{C}_i$'}</Latex>: <span className="font-sans text-base">Predicted and true confidence scores. The true confidence is 1 if an object's center is in the cell and 0 otherwise.</span></li>
              <li><Latex>{'$p_i(c)$'}</Latex> & <Latex>{'$(\\hat{p}_i(c))$'}</Latex>: <span className="font-sans text-base">Predicted and true class probabilities for a specific class 'c', only if an object is present.</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-500">
          <CardHeader>
            <CardTitle className="text-2xl text-red-700">Algorithm Focus: Non-Max Suppression (A Greedy Approach)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>After the model makes its predictions, we are often left with multiple bounding boxes for the same object. NMS is the greedy algorithm used to clean this up.</p>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <h4 className="font-semibold mb-2">Algorithm: Non-Max Suppression</h4>
                <ol className="list-decimal list-inside space-y-2 font-mono text-sm">
                    <li><strong>INPUT:</strong> A list of prediction boxes <Latex>{"$B$"}</Latex>, confidence scores <Latex>{"$C$"}</Latex>, and an IOU threshold <Latex>{"$N_t$"}</Latex>.</li>
                    <li><strong>STEP 1:</strong> Select the box <Latex>{"$b_{\\text{max}}"}</Latex> from <Latex>{"$B$"}</Latex> with the highest confidence score in <Latex>{"$C$"}</Latex> and add it to a final list of predictions, <Latex>{"$D$"}</Latex>.</li>
                    <li><strong>STEP 2:</strong> Remove <Latex>{"$b_{\\text{max}}"}</Latex> from <Latex>{"$B$"}</Latex>.</li>
                    <li><strong>STEP 3:</strong> For each remaining box <Latex>{"$b_i$"}</Latex> in <Latex>{"$B$"}</Latex>, calculate its Intersection over Union (IOU) with <Latex>{"$b_{\\text{max}}"}</Latex>.</li>
                    <li><strong>STEP 4:</strong> If IOU(<Latex>{"$b_{\\text{max}}, b_i$"}</Latex>) &gt; <Latex>{"$N_t$"}</Latex>, remove <Latex>{"$b_i$"}</Latex> from <Latex>{"$B$"}</Latex> (as it is considered a duplicate).</li>
                    <li><strong>STEP 5:</strong> Repeat from Step 1 until <Latex>{"$B$"}</Latex> is empty.</li>
                    <li><strong>OUTPUT:</strong> The final list of curated boxes, <Latex>{"$D$"}</Latex>.</li>
                </ol>
            </div>
            <p className="mt-4">This is a <strong>greedy</strong> approach because at each step, it makes the locally optimal choice of picking the highest-confidence box, without looking back or considering a global optimal solution.</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
