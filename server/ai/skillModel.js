import * as tf from "@tensorflow/tfjs";

/*
Input features:
[ accuracy, blunders, moveCount ]

Output:
0 → Beginner
1 → Intermediate
2 → Advanced
*/

let model = null;

function createModel() {
  const m = tf.sequential();

  m.add(tf.layers.dense({ inputShape: [3], units: 8, activation: "relu" }));
  m.add(tf.layers.dense({ units: 8, activation: "relu" }));
  m.add(tf.layers.dense({ units: 3, activation: "softmax" }));

  m.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  return m;
}

// Small synthetic dataset (demo-safe)
async function trainModel(m) {
  const xs = tf.tensor2d([
    [40, 5, 10],   // bad play
    [50, 4, 15],
    [65, 3, 20],
    [75, 2, 25],   // average
    [85, 1, 30],
    [92, 0, 35],   // strong
  ]);

  const ys = tf.tensor2d([
    [1, 0, 0], // Beginner
    [1, 0, 0],
    [0, 1, 0], // Intermediate
    [0, 1, 0],
    [0, 0, 1], // Advanced
    [0, 0, 1],
  ]);

  await m.fit(xs, ys, { epochs: 50, verbose: 0 });
}

export async function loadSkillModel() {
  if (!model) {
    model = createModel();
    await trainModel(model);
  }
}

export function predictSkill({ accuracy, blunders, moves }) {
  const input = tf.tensor2d([[accuracy, blunders, moves]]);
  const prediction = model.predict(input);
  const index = prediction.argMax(1).dataSync()[0];

  const labels = ["Beginner", "Intermediate", "Advanced"];
  return labels[index];
}
