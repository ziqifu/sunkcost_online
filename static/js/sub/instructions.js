var INST_RATIO = 1.77;
var INST_HEIGHT = window.innerHeight;
var INST_WIDTH = INST_RATIO * INST_HEIGHT;
var INSTIDX = 1;

// Image Instructions
var inst_image = {
  type: 'image-keyboard-response',
  stimulus: function() {
    return `static/images/instructions/Slide${INSTIDX}.png`;
  },
  choices: ['leftarrow', 'rightarrow'],
  stimulus_height: INST_HEIGHT,
  stimulus_width: INST_WIDTH,
  post_trial_gap: 1000,
  on_finish: function(data) {
    key_press = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press);
    if (key_press == 'rightarrow') {
      INSTIDX++;
    } else {
      INSTIDX = Math.max(1, INSTIDX - 1);
    }
  }
};

var instructions = {
  timeline: [inst_image],
  loop_function: function() {
    if (INSTIDX > 12) {
      return false;
    }
    return true;
  }
};
