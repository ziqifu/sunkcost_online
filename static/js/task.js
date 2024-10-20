// Miscelaneous 
jsPsych.data.addProperties({
  subject: Math.random().toString(36).slice(2), 
  date: Date.now()
});

var fs = {
 type: 'fullscreen', 
 fullscreen_mode: true,
 on_start: function(){
   // set up task appearence
   document.body.style.background = "white";
   document.body.style.color = 'black'   
 }
};

// Preload images
img_preload = []; 
 for(let n=1; n<=12; n++) {
     img_preload.push(`static/images/instructions/Slide${n}.png`); 
 }
img_preload.push('static/images/stim/loading.gif', 'static/images/stim/invest_display/E3S40_S1.svg', 
                'static/images/stim/invest_display/E3S50_S1.svg','static/images/stim/invest_display/E3S60_S1.svg',
                'static/images/stim/invest_display/E3S40_S2.svg','static/images/stim/invest_display/E3S50_S2.svg',
                'static/images/stim/invest_display/E3S60_S2.svg', 'static/images/stim/invest_display/E4S40_S1.svg', 
                'static/images/stim/invest_display/E4S50_S1.svg','static/images/stim/invest_display/E4S60_S1.svg',
                'static/images/stim/invest_display/E4S40_S2.svg','static/images/stim/invest_display/E4S50_S2.svg',
                'static/images/stim/invest_display/E4S60_S2.svg', 'static/images/stim/invest_display/E3S0_S1.svg',
                'static/images/stim/invest_display/E4S0_S1.svg','static/images/stim/remind/E3_remind.svg',
                'static/images/stim/remind/E4_remind.svg')



// Setup Timeline
/*if(DEBUGMODE) {
 timeline = [fs, init_learning_phase, instructions, learning_phase, init_choice_phase, instructions, choice_phase, instructions, init_mock_phase, mock_phase, task2Q, demographics, end_screen];
} else {
 timeline = [fs, consent, init_learning_phase, instructions, learning_phase, init_choice_phase, instructions, choice_phase, instructions, init_mock_phase, mock_phase, instructions, SoC_phase, task2Q, demographics, end_screen];
}
*/
 //timeline = [debrief_questions, end_screen]; 
 timeline = [NFC]; 

save_to_db = function() {
 $.ajax({
   type: "POST",
   url: "/save_data",
   data: jsPsych.data.get().json(),
   contentType: "application/json",
   dataType: 'json',
   success: function(result) {
     if(result) {
       console.log(result);
     }
   }
 })
};

// Run and preload images
jsPsych.init({
   timeline: timeline,
   show_preload_progress_bar: true,
   preload_images: img_preload,
   on_finish: function() {/*
     if(DEBUGMODE) {
       jsPsych.data.get().localSave('csv', '_debug.csv');
       return null;
     }

     Promise.all([save_to_db()]).then(() => {
       save_to_db(); 
       window.open('https://app.prolific.co/submissions/complete?cc=XXXXXXX', '_blank');
     }).catch(() => {
       // resubmit
       save_to_db();
       window.open('https://app.prolific.co/submissions/complete?cc=XXXXXXX', '_blank');
     })*/
    jsPsych.data.get().localSave('csv', 'sceff_pilot_local.csv'); // only for piloting

   }
});
