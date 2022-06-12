const width = 2000, height = 2000
const axiom = "F"
const rules = [
  ["F", "FF+[+F-F-F]-[-F+F+F]"],
]
let sentence = axiom
let len = height / 4.5
let angle

function generate() {
  len *= 0.5;
  let nextSentence = ""

  for (let i = 0; i < sentence.length; i++) {
    let found = false;
    let current = sentence.charAt(i);
    for (let rule of rules) {
      if (rule[0] === current) {
        found = true
        nextSentence += rule[1]
        break;
      }
    }
    if (!found) {
      nextSentence += current
    }
  }
  sentence = nextSentence
  createP(sentence)
  tree()
}

function tree() {
  background(255);
  resetMatrix();
  translate(width / 2, 0);
  stroke(0, 100);
  const min = -15, max = -24
  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);

    if (current == "F") {
      angle = radians(random(min, max));
      line(0, 0, 0, len);
      translate(0, len);
    } else if (current == "+") {
      angle = radians(random(min, max));
      rotate(angle);
    } else if (current == "-") {
      angle = radians(random(min, max));
      rotate(-angle)
    } else if (current == "[") {
      angle = radians(random(min, max));
      push();
    } else if (current == "]") {
      angle = radians(random(min, max));
      pop();
    }
  }
}

function setup() {
  createCanvas(width, height);
  angle = radians(-16);
  background(255);
  createP(axiom);
  tree();
  const btn = createButton("generate")
  btn.mousePressed(generate)
}