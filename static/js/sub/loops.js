/* a single phase: invest + math
var math_phase = {
  timeline: [math_display, math_choices, math_feedback],
  conditional_function: function () {
    var invest_choice = jsPsych.data.get().last(1).values()[0];
    // Check if chosen to invest
    if (invest_index == 'y') {
      return true; // Proceed with math phase
    } else {
      return false; // Skip math phase
    }
  }
};

var not_invested = {
  timeline: [invest_feedback],
  conditional_function: function () {
    var invest_choice = jsPsych.data.get().last(2).values()[0];
    // Check if chosen to invest
    if (invest_choice != 'y') {
      return true; // Proceed with math phase
    } else {
      return false; // Skip math phase
    }
  }
};

var a_trial = {
  timeline: [invest_display, invest_feedback, math_phase, not_invested]
}


var stageLoopNode = {
  timeline: [load_remind, invest_display, invest_feedback, math_display, math_choices, math_feedback],
  conditional_function: function(){
    console.log(STAGE);
      if(STAGE > 1){
          return false;
      } else {
        STAGE++;
          return true;
      }
  }
}
*/
   
// 2 stages in a single trial to loop over all conditions
var conditionLoopNode = {
  timeline: [load_remind, invest_display, invest_feedback, math_display, math_choices, math_speedup, math_feedback, save_data],
  loop_function: function() {
    console.log('math_n_3 before', math_n_3)
    console.log('math_n_4 before', math_n_4)
    if (EFF_LVL == 3) math_n_3++; //update indice for math problems & choices
    else math_n_4++;
    if(trial_n >= 10) {
      return false; 
    } 
    else {
      return true;
    }
  }
};



/* Loop over all conditions
var conditionLoopNode = {
  timeline: [loading, a_stage],
  loop_function: function () {
    if (trial_n >= conditions.length - 1) {
      trial_n = 0;
      EFF_LVL = null;
      SUC_PROB = null;
      PRE_EFF = null;
      PRE_SUC = null;
      save_to_db();
      return false;
    }
    trial_n++;
    timedout = false;
    return true;
  }
};
*/
